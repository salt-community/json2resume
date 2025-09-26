from flask import Flask, request, Response, jsonify
from weasyprint import HTML
import os
from pathlib import Path
import re
import base64
import mimetypes
from urllib.parse import urlparse

app = Flask(__name__)


@app.get("/")
def health():
    return jsonify(status="ok"), 200


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

    if request.is_json:
        data = request.get_json(silent=True) or {}
        html = data.get("html")
    if html is None:
        html = request.form.get("html")
    if html is None:
        # Fallback to raw body if content-type is text/html or text/plain or unspecified
        raw = request.get_data(cache=False, as_text=True)
        html = raw if raw and raw.strip() else None

    if not html:
        return jsonify(error="No HTML provided. Send as JSON {\"html\": \"...\"}, form field 'html', or raw body."), 400

    # Inline any local <img src="..."> as data URIs so they always render in the PDF.
    html = embed_local_images(html, base_dir=app.root_path)

    # Inline CSS in the provided HTML is applied by WeasyPrint automatically.
    # Ensure relative asset paths (e.g., <img src="small-bird.png">) resolve to local files.
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
