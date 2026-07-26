"""Report schemas."""

from pydantic import BaseModel


class ReportCreateRequest(BaseModel):
    prediction_id: int


class ReportResponse(BaseModel):
    id: int
    prediction_id: int
    download_url: str
    created_at: str

    model_config = {"from_attributes": True}
