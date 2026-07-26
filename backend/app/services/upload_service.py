"""Prescription upload handling."""

from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models import Upload
from app.ocr.easyocr_service import extract_text

logger = get_logger(__name__)


async def save_upload(
    db: AsyncSession,
    file_bytes: bytes,
    filename: str,
    content_type: str,
    user_id: int | None = None,
) -> Upload:
    settings = get_settings()
    upload_dir = settings.runtime_directories[2]
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_name = f"{uuid.uuid4().hex}_{Path(filename).name}"
    file_path = upload_dir / safe_name
    file_path.write_bytes(file_bytes)

    ocr_text, ocr_error = extract_text(file_bytes, content_type, filename)
    if ocr_error:
        logger.warning("OCR failed for upload %s: %s", filename, ocr_error)

    upload = Upload(
        user_id=user_id,
        filename=filename,
        content_type=content_type,
        file_path=str(file_path),
        ocr_text=ocr_text,
        ocr_error=ocr_error,
    )
    db.add(upload)
    await db.flush()
    await db.refresh(upload)
    return upload
