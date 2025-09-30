/*
 * Lightweight template engine for the JSON Resume + Gist template syntax.
 *
 * Supported syntax (matches your gist template):
 *   - Variables:            >>[path]<<            e.g., >>[basics.name]<<, >>[.]<<
 *   - Conditionals:         [[#if path]] ... [[/if]]
 *                           [[#if !path]] ... [[/if]]   (negation)
 *   - Iteration:            [[#each path]] ... [[/each]]
 *   - Join (inline helper): [[#join path|, ]]  // optional, joins array of primitives by separator
 *
 * Path rules:
 *   - "." means the current item in an [[#each]] block (for arrays of strings use >>[.]<<)
 *   - Relative lookup prefers the current context, then falls back to the root
 *   - Absolute/rooted lookup is also possible by using full paths like "basics.name"
 *
 * Escaping:
 *   - By default all injected values are HTML-escaped to protect against XSS.
 *   - To allow safe HTML snippets, pass { htmlEscape: false } in options for *this render call*.
 */

export type JsonLike =
  | Record<string, any>
  | any[]
  | string
  | number
  | boolean
  | null
  | undefined

// Alias for external consumers (your components expect this)
export type ResumeData = Record<string, any>

export interface RenderOptions {
  /** HTML-escape all injected values (default: true) */
  htmlEscape?: boolean
}

// ---------------------------- Tokenizing / Parsing ----------------------------

type Node = TextNode | VarNode | IfNode | EachNode | JoinNode

interface TextNode {
  type: 'text'
  value: string
}

interface VarNode {
  type: 'var'
  path: string
}

interface IfNode {
  type: 'if'
  path: string
  negate: boolean
  children: Node[]
}

interface EachNode {
  type: 'each'
  path: string
  children: Node[]
}

interface JoinNode {
  type: 'join'
  path: string
  sep: string
}

const VAR_OPEN = '>>['
const VAR_CLOSE = ']<<'
const BLK_OPEN = '[[#'
const BLK_CLOSE_OPEN = '[[/'
const TAG_CLOSE = ']]'

class TemplateParseError extends Error {}

function parse(template: string): Node[] {
  let i = 0
  const len = template.length

  type Frame = {
    type: 'root' | 'if' | 'each'
    node?: IfNode | EachNode
    children: Node[]
  }
  const stack: Frame[] = [{ type: 'root', children: [] }]

  function currChildren(): Node[] {
    return stack[stack.length - 1].children
  }

  function pushNode(n: Node) {
    currChildren().push(n)
  }

  function startsWithAt(s: string) {
    return template.startsWith(s, i)
  }

  function readUntil(marker: string): string {
    const idx = template.indexOf(marker, i)
    if (idx === -1)
      throw new TemplateParseError(`Unclosed tag, expected "${marker}".`)
    const out = template.slice(i, idx)
    i = idx + marker.length
    return out
  }

  while (i < len) {
    // Next special token index
    const nextVar = template.indexOf(VAR_OPEN, i)
    const nextBlk = template.indexOf('[[', i) // either open or close
    const next = [nextVar, nextBlk]
      .filter((n) => n !== -1)
      .sort((a, b) => a - b)[0]

    if (next === undefined) {
      // No more tags; flush remaining text
      pushNode({ type: 'text', value: template.slice(i) })
      break
    }

    if (next > i) {
      pushNode({ type: 'text', value: template.slice(i, next) })
      i = next
    }

    // Variable: >>[path]<<
    if (startsWithAt(VAR_OPEN)) {
      i += VAR_OPEN.length
      const inside = readUntil(VAR_CLOSE).trim()
      pushNode({ type: 'var', path: inside })
      continue
    }

    // Block open: [[#if ...]] | [[#each ...]] | [[#join ...]]
    if (startsWithAt(BLK_OPEN)) {
      i += BLK_OPEN.length
      const head = readUntil(TAG_CLOSE).trim() // e.g. "if basics.label" or "each work" or "join tags|, "
      const [keyword, ...restParts] = head.split(/\s+/)
      const rest = restParts.join(' ').trim()

      if (keyword === 'if') {
        const negate = rest.startsWith('!')
        const path = negate ? rest.slice(1).trim() : rest
        const node: IfNode = { type: 'if', path, negate, children: [] }
        stack.push({ type: 'if', node, children: node.children })
        continue
      }

      if (keyword === 'each') {
        const path = rest
        const node: EachNode = { type: 'each', path, children: [] }
        stack.push({ type: 'each', node, children: node.children })
        continue
      }

      if (keyword === 'join') {
        // Syntax: [[#join path|separator]] — separator optional (default ", ")
        let joinPath = rest
        let sep = ', '
        const pipeIdx = rest.indexOf('|')
        if (pipeIdx !== -1) {
          joinPath = rest.slice(0, pipeIdx).trim()
          sep = rest.slice(pipeIdx + 1) // keep as-is (allows spaces)
        }
        pushNode({ type: 'join', path: joinPath.trim(), sep })
        continue
      }

      // Unknown keyword -> treat literally
      pushNode({ type: 'text', value: `[[#${head}]]` })
      continue
    }

    // Block close: [[/if]] or [[/each]]
    if (startsWithAt(BLK_CLOSE_OPEN)) {
      i += BLK_CLOSE_OPEN.length
      const head = readUntil(TAG_CLOSE).trim() // e.g. "if" or "each"

      if (head === 'if' || head === 'each') {
        // Pop until matching
        for (let j = stack.length - 1; j >= 0; j--) {
          const f = stack[j]
          if (f.type === head) {
            // Close this frame
            const closed = stack.pop()!
            const node = closed.node as unknown as Node
            // Append the completed block to the new current frame
            pushNode(node)
            break
          }
          if (j === 0)
            throw new TemplateParseError(`Mismatched closing tag [[/${head}]]`)
        }
        continue
      }

      // Unknown closing tag — keep literally
      pushNode({ type: 'text', value: `[[/${head}]]` })
      continue
    }

    // Fallback safety: if we got here, consume a single char to avoid infinite loop
    pushNode({ type: 'text', value: template[i] })
    i += 1
  }

  if (stack.length !== 1) {
    throw new TemplateParseError('Unclosed block(s) in template.')
  }

  return stack[0].children
}

// ---------------------------- Rendering ----------------------------

function htmlEscape(s: unknown): string {
  const str = s == null ? '' : String(s)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isTruthy(val: any): boolean {
  if (val == null) return false
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val !== 0 && !Number.isNaN(val)
  if (typeof val === 'string') return val.trim().length > 0
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  return Boolean(val)
}

function getNested(obj: any, path: string): any {
  if (!path || path === '.') return obj
  const parts = path.split('.')
  let curr = obj
  for (const part of parts) {
    if (curr == null) return undefined
    // numeric indexes (not used in your template, but harmless)
    const key: any = /^\d+$/.test(part) ? Number(part) : part
    curr = curr[key]
  }
  return curr
}

function resolvePath(path: string, ctxStack: any[], root: any): any {
  // Current context is the top of stack
  const ctx = ctxStack[ctxStack.length - 1]

  if (!path || path === '.' || path === 'this') return ctx

  // Special handling for basics.image - prioritize uploadedImage over image
  if (path === 'basics.image' || path === 'image') {
    const basics = getNested(root, 'basics')
    if (basics) {
      // Return uploadedImage if available, otherwise fall back to image
      return basics.uploadedImage || basics.image
    }
  }

  // Absolute-ish lookup (dot in path) — prefer root for clarity like "basics.name"
  if (path.includes('.')) {
    const fromRoot = getNested(root, path)
    if (fromRoot !== undefined) return fromRoot
    // If not in root, try current context
    return getNested(ctx, path)
  }

  // Single-segment relative lookup — prefer current context, then root
  const rel = getNested(ctx, path)
  if (rel !== undefined) return rel
  return getNested(root, path)
}

function renderNodes(
  nodes: Node[],
  ctxStack: any[],
  root: any,
  opt: Required<RenderOptions>,
): string {
  let out = ''

  for (const n of nodes) {
    switch (n.type) {
      case 'text':
        out += n.value
        break

      case 'var': {
        const val = resolvePath(n.path, ctxStack, root)
        const str =
          val == null
            ? ''
            : typeof val === 'object'
              ? JSON.stringify(val)
              : String(val)
        out += opt.htmlEscape ? htmlEscape(str) : String(str)
        break
      }

      case 'if': {
        const val = resolvePath(n.path, ctxStack, root)
        const should = n.negate ? !isTruthy(val) : isTruthy(val)
        if (should) out += renderNodes(n.children, ctxStack, root, opt)
        break
      }

      case 'each': {
        const arr = resolvePath(n.path, ctxStack, root)
        if (Array.isArray(arr)) {
          for (const item of arr) {
            ctxStack.push(item)
            out += renderNodes(n.children, ctxStack, root, opt)
            ctxStack.pop()
          }
        }
        break
      }

      case 'join': {
        const arr = resolvePath(n.path, ctxStack, root)
        if (Array.isArray(arr)) {
          const parts = arr.map((v) => {
            const s =
              v == null
                ? ''
                : typeof v === 'object'
                  ? JSON.stringify(v)
                  : String(v)
            return opt.htmlEscape ? htmlEscape(s) : String(s)
          })
          out += parts.join(n.sep)
        }
        break
      }

      default:
        // exhaustive check
        const _ex: never = n
        void _ex
    }
  }

  return out
}

export interface CompiledTemplate {
  render(data: JsonLike, options?: RenderOptions): string
}

const compileCache = new Map<string, Node[]>()

export function compile(template: string): CompiledTemplate {
  const ast = compileCache.get(template) ?? parse(template)
  compileCache.set(template, ast)

  return {
    render(data: JsonLike, options?: RenderOptions) {
      const opt: Required<RenderOptions> = {
        htmlEscape: options?.htmlEscape !== false,
      }
      const root = data as any
      return renderNodes(ast, [root], root, opt)
    },
  }
}

export function renderTemplate(
  template: string,
  data: JsonLike,
  options?: RenderOptions,
): string {
  return compile(template).render(data, options)
}

// ---------------------------- Small self-test (optional) ----------------------------
// Uncomment for quick verification in dev environments.
// const demo = {
//   basics: { name: 'John Doe', label: 'Programmer', email: 'john@gmail.com', location: { city: 'SF' }, summary: 'Hello <b>world</b>', profiles: [{ network: 'Twitter', username: 'john', url: 'https://twitter.com/john' }] },
//   skills: [{ name: 'Web Dev', level: 'Master', keywords: ['HTML', 'CSS', 'JS'] }],
// }
// const tpl = 'Hello >>[basics.name]<< [[#if basics.label]](>>[basics.label]<<)[[/if]] [[#if !basics.foo]]no foo![[/if]] [[#each skills]]| >>[name]<<: [[#join keywords|, ]] [[/each]]'
// console.log(renderTemplate(tpl, demo))
