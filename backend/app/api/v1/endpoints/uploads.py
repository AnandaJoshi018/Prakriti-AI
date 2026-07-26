"""Prescription upload endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from app.auth.dependencies import get_current_user_optional
from app.core.config import get_settings
from app.core.database import get_db
from app.core.exceptions import ValidationError
from app.models import User
from app.schemas.upload import UploadResponse
from app.services.upload_service import save_upload
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
}


@router.post("/prescription", response_model=UploadResponse, status_code=201)
async def upload_prescription(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User | None, Depends(get_current_user_optional)],
    file: UploadFile = File(...),
) -> UploadResponse:
    settings = get_settings()
    content_type = file.content_type or "application/octet-stream"

    if content_type not in ALLOWED_TYPES and not (
        file.filename and file.filename.lower().endswith((".pdf", ".jpg", ".jpeg", ".png"))
    ):
        raise ValidationError("Only PDF, PNG, JPG and JPEG files are supported.")

    file_bytes = await file.read()
    if len(file_bytes) > settings.max_upload_size_bytes:
        raise ValidationError(f"File exceeds {settings.max_upload_size_mb}MB limit")

    upload = await save_upload(
        db,
        file_bytes,
        file.filename or "upload",
        content_type,
        user.id if user else None,
    )

    return UploadResponse(
        id=upload.id,
        filename=upload.filename,
        content_type=upload.content_type,
        ocr_text=upload.ocr_text,
        ocr_error=upload.ocr_error,
    )
