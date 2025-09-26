from flask import Flask, request, Response, jsonify
from weasyprint import HTML
import os
from pathlib import Path
import re
import base64
import mimetypes
from urllib.parse import urlparse
import json
from typing import Any, Dict, Optional, Tuple
import ast
import binascii

app = Flask(__name__)


@app.get("/")
def health():
    return jsonify(status="ok"), 200


def guess_mime_from_bytes(data: bytes) -> Optional[str]:
    if not data:
        return None
    # Simple magic number sniffing
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data.startswith(b"GIF87a") or data.startswith(b"GIF89a"):
        return "image/gif"
    if data.startswith(b"BM"):
        return "image/bmp"
    return None


def decode_image_value(value: Any, filename_hint: Optional[str] = None) -> Tuple[Optional[str], Optional[bytes]]:
    """
    Decode a provided image value into (mime, bytes).
    Accepts:
      - data URI string: "data:image/png;base64,...."
      - base64 string (no prefix)
      - Python bytes-literal text: b'\\x89PNG...'
      - bytes / bytearray
      - dicts like {"data_uri": "..."} or {"bytes": "...", "mime": "..."}
    """
    def mime_from_hint_or_sniff(b: Optional[bytes]) -> Optional[str]:
        if filename_hint:
            mt = mimetypes.guess_type(filename_hint)[0]
            if mt:
                return mt
        if b:
            return guess_mime_from_bytes(b)
        return None

    # Direct bytes
    if isinstance(value, (bytes, bytearray)):
        b = bytes(value)
        return mime_from_hint_or_sniff(b), b

    # Mapping forms
    if isinstance(value, dict):
        if "data_uri" in value and isinstance(value["data_uri"], str):
            s = value["data_uri"].strip()
            if s.startswith("data:"):
                head, _, payload = s.partition(",")
                mime = head[5:].split(";")[0] or mime_from_hint_or_sniff(None)
                if ";base64" in head:
                    try:
                        b = base64.b64decode(payload, validate=False)
                    except Exception:
                        return mime, None
                else:
                    from urllib.parse import unquote_to_bytes
                    b = unquote_to_bytes(payload)
                return mime or mime_from_hint_or_sniff(b), b
        if "bytes" in value:
            inner = value["bytes"]
            mime = value.get("mime") or mime_from_hint_or_sniff(None)
            inner_mime, b = decode_image_value(inner, filename_hint=filename_hint)
            if not b:
                return mime, None
            return mime or inner_mime or mime_from_hint_or_sniff(b), b

    # String forms
    if isinstance(value, str):
        s = value.strip()

        # Data URI
        if s.startswith("data:"):
            head, _, payload = s.partition(",")
            mime = head[5:].split(";")[0] or mime_from_hint_or_sniff(None)
            if ";base64" in head:
                try:
                    b = base64.b64decode(payload, validate=False)
                except Exception:
                    return mime, None
            else:
                from urllib.parse import unquote_to_bytes
                b = unquote_to_bytes(payload)
            return mime or mime_from_hint_or_sniff(b), b

        # Python bytes-literal text
        if (s.startswith("b'") and s.endswith("'")) or (s.startswith('b"') and s.endswith('"')):
            try:
                evaluated = ast.literal_eval(s)
                if isinstance(evaluated, (bytes, bytearray)):
                    b = bytes(evaluated)
                    return mime_from_hint_or_sniff(b), b
            except Exception:
                pass

        # Base64
        try:
            b = base64.b64decode(s, validate=True)
            return mime_from_hint_or_sniff(b), b
        except binascii.Error:
            pass
        except Exception:
            pass

        # Fallback: raw text bytes
        b = s.encode("latin-1", errors="ignore")
        return mime_from_hint_or_sniff(b), b

    return None, None


@app.post("/debug/image")
def debug_image():
    """
    Accepts an 'image' field (JSON or form) and returns the decoded image bytes.
    This helps verify that the provided text reassembles into a valid image.
    """
    image_value: Any = None
    if request.is_json:
        data = request.get_json(silent=True) or {}
        image_value = data.get("image")
    if image_value is None:
        image_value = request.form.get("image")

    if image_value is None or (isinstance(image_value, str) and not image_value.strip()):
        return jsonify(error="Provide 'image' in JSON or form."), 400

    mime, data = decode_image_value(image_value, filename_hint="small-bird.png")
    if not data:
        return jsonify(error="Could not decode 'image' into bytes"), 400

    return Response(
        data,
        mimetype=mime or "application/octet-stream",
        headers={"Content-Disposition": 'inline; filename="image.png"'},
    )

def embed_provided_images(html: str, images: Dict[str, Any]) -> str:
    """
    Replace <img src="..."> with data: URIs using images supplied through the HTTP request.
    The 'images' dict can contain:
      - key: filename (e.g., "small-bird-1.png")
      - value: one of
          * data URI string: "data:image/png;base64,..."
          * base64 string (no prefix)
          * object: {"data_uri": "..."} or {"bytes": "<base64 or raw text>", "mime": "image/png"}
    We try exact filename matches first, then basename matches.
    """
    if not html or not images:
        return html

    # Normalize provided images to a {name: data_uri} dict
    def to_data_uri(name: str, value: Any) -> Optional[str]:
        # If it's already a data URI string, keep it verbatim
        if isinstance(value, str) and value.strip().startswith("data:"):
            return value.strip()

        mime, b = decode_image_value(value, filename_hint=name)
        if b is None:
            return None
        if not mime:
            mime = mimetypes.guess_type(name)[0] or guess_mime_from_bytes(b) or "application/octet-stream"
        return f"data:{mime};base64,{base64.b64encode(b).decode('ascii')}"

    normalized: Dict[str, str] = {}
    for k, v in images.items():
        if not isinstance(k, str):
            continue
        data_uri = to_data_uri(k, v)
        if data_uri:
            normalized[k] = data_uri
            # Also allow basename lookup
            basename = os.path.basename(k)
            normalized.setdefault(basename, data_uri)

    if not normalized:
        return html

    # Replace <img ... src="..."> where the src matches any provided name (exact or basename)
    pattern = re.compile(r'(<img\b[^>]*\bsrc=)(["\'])([^"\']+)\2', flags=re.IGNORECASE)

    def repl(m: re.Match) -> str:
        prefix, quote, url = m.group(1), m.group(2), m.group(3)
        # Skip if already data: or external
        parsed = urlparse(url)
        if parsed.scheme in ("http", "https", "data", "file"):
            return m.group(0)

        # Try direct and basename mappings
        candidate = normalized.get(url) or normalized.get(os.path.basename(url))
        if not candidate:
            return m.group(0)

        return f"{prefix}{quote}{candidate}{quote}"

    return pattern.sub(repl, html)



def embed_local_images(html: str, base_dir: str) -> str:
    """
    Replace <img src="..."> that points to local files with data: URIs so images
    are embedded directly into the HTML for WeasyPrint.
    Only relative/local paths under base_dir are inlined; external URLs and data: are kept as-is.
    """
    if not html:
        return html

    base_dir_real = os.path.realpath(base_dir)

    # Match: <img ... src="VALUE" ...> capturing the src attribute value and quote char
    pattern = re.compile(r'(<img\b[^>]*\bsrc=)(["\'])([^"\']+)\2', flags=re.IGNORECASE)

    def repl(m: re.Match) -> str:
        prefix, quote, url = m.group(1), m.group(2), m.group(3)
        parsed = urlparse(url)

        # Skip external or already inlined images
        if parsed.scheme in ("http", "https", "data"):
            return m.group(0)

        # Resolve to an absolute path within base_dir
        candidate_path = url if os.path.isabs(url) else os.path.join(base_dir_real, url)
        real_path = os.path.realpath(candidate_path)

        # Security: ensure the resolved path stays within base_dir
        if not (real_path == base_dir_real or real_path.startswith(base_dir_real + os.sep)):
            return m.group(0)

        if not os.path.isfile(real_path):
            return m.group(0)

        mime, _ = mimetypes.guess_type(real_path)
        if not mime:
            mime = "application/octet-stream"

        try:
            with open(real_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("ascii")
            data_uri = f"data:{mime};base64,{b64}"
            return f"{prefix}{quote}{data_uri}{quote}"
        except Exception:
            # On any error, keep original
            return m.group(0)

    return pattern.sub(repl, html)


@app.post("/convert")
def convert_html_to_pdf():
    # Accept HTML via:
    # - JSON: {"html": "..."}
    # - Form: html=...
    # - Raw body: text/html or text/plain
    html = None

    provided_image_value: Any = None

    if request.is_json:
        data = request.get_json(silent=True) or {}
        html = data.get("html")
        # Accept a single image under the key "image" (data URI or base64 string)
        provided_image_value = data.get("image")
    if html is None:
        # Accept form fields: 'html' and 'image'
        if "image" in request.form:
            provided_image_value = request.form.get("image")
        html = request.form.get("html")
    if html is None:
        # Fallback to raw body if content-type is text/html or text/plain or unspecified
        raw = request.get_data(cache=False, as_text=True)
        html = raw if raw and raw.strip() else None

    if not html:
        return jsonify(error="No HTML provided. Send as JSON {\"html\": \"...\"}, form field 'html', or raw body."), 400

    # If an 'image' was provided, embed it to replace <img src="small-bird.png">.
    if provided_image_value is not None and (not isinstance(provided_image_value, str) or provided_image_value.strip()):
        html = embed_provided_images(html, {"small-bird.png": provided_image_value})
    else:
        # Otherwise, attempt to inline a local file if present.
        html = embed_local_images(html, base_dir=app.root_path)

    # Inline CSS in the provided HTML is applied by WeasyPrint automatically.
    pdf_bytes = HTML(string=html, base_url=Path(app.root_path).resolve().as_uri()).write_pdf()

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": 'inline; filename="document.pdf"'
        },
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)
