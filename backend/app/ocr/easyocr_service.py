"""EasyOCR and PDF text extraction service."""

from __future__ import annotations

from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image

from app.core.logging import get_logger

logger = get_logger(__name__)

_reader = None


def _get_reader():
    global _reader
    if _reader is None:
        import easyocr
        _reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    return _reader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = [page.get_text() for page in doc]
    doc.close()
    return "\n".join(p.strip() for p in pages if p.strip())


def extract_text_from_image(file_bytes: bytes) -> str:
    reader = _get_reader()
    image = Image.open(BytesIO(file_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    results = reader.readtext(image, detail=0, paragraph=True)
    return "\n".join(str(line).strip() for line in results if str(line).strip())


def extract_text(file_bytes: bytes, content_type: str, filename: str) -> tuple[str | None, str | None]:
    """Extract text from uploaded file. Returns (text, error)."""
    try:
        ext = Path(filename).suffix.lower()
        if content_type == "application/pdf" or ext == ".pdf":
            text = extract_text_from_pdf(file_bytes)
        elif content_type.startswith("image/") or ext in {".jpg", ".jpeg", ".png"}:
            text = extract_text_from_image(file_bytes)
        else:
            return None, f"Unsupported file type: {content_type}"
        return text or None, None
    except Exception as exc:
        logger.error("OCR extraction failed for %s: %s", filename, exc)
        return None, str(exc)
