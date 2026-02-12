import { describe, expect, test } from 'vitest'
import { renderTemplate } from '../components/GistTemplate/templateEngine'

describe('Template Engine - Value Comparison', () => {
    const data = {
        example: {
            path: {
                value: 'se',
                otherValue: 'en',
                number: 123,
            }
        }
    }

    test('supports equality check (==)', () => {
        const template = '[[#if example.path.value == se]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('Match')
    })

    test('supports inequality check (!=)', () => {
        const template = '[[#if example.path.value != en]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('Match')
    })

    test('supports equality check mismatch', () => {
        const template = '[[#if example.path.value == en]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('')
    })

    test('supports inequality check mismatch', () => {
        const template = '[[#if example.path.value != se]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('')
    })

    test('supports numeric equality check', () => {
        // Note: Inputs in template are strings, so "123" == 123 should ideally work if we use lenient comparison or string conversion
        const template = '[[#if example.path.number == 123]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('Match')
    })

    test('supports double quoted string comparison', () => {
        const template = '[[#if example.path.value == "se"]]Match[[/if]]'
        const result = renderTemplate(template, data)
        expect(result).toBe('Match')
    })

    test('supports single quoted string comparison', () => {
        const template = "[[#if example.path.value == 'se']]Match[[/if]]"
        const result = renderTemplate(template, data)
        expect(result).toBe('Match')
    })
})
