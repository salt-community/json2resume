from flask import Flask, request, Response, jsonify
from weasyprint import HTML
import os

app = Flask(__name__)


@app.get("/")
def health():
    return jsonify(status="ok"), 200


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

    # Inline CSS in the provided HTML is applied by WeasyPrint automatically.
    pdf_bytes = HTML(string=html, base_url=request.base_url).write_pdf()

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
