"""Upload response schemas."""

from pydantic import BaseModel


class UploadResponse(BaseModel):
    id: int
    filename: str
    content_type: str
    ocr_text: str | None = None
    ocr_error: str | None = None
