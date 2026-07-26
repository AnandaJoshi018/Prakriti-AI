"""PDF report endpoints."""

from __future__ import annotations

import json
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user_optional
from app.core.config import get_settings
from app.core.database import get_db
from app.core.exceptions import NotFoundError
from app.models import Prediction, Report, User
from app.pdf.report_generator import generate_prediction_report
from app.schemas.prediction import AssessmentAnswers, DoshaPercentages, PredictionDetailResponse, RecommendationBlock
from app.schemas.report import ReportCreateRequest, ReportResponse

router = APIRouter()


@router.post("", response_model=ReportResponse, status_code=201)
async def create_report(
    payload: ReportCreateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User | None, Depends(get_current_user_optional)],
) -> ReportResponse:
    prediction = await db.get(Prediction, payload.prediction_id)
    if prediction is None:
        raise NotFoundError("Prediction not found")

    assessment = None
    if prediction.assessment_json:
        assessment = AssessmentAnswers(**json.loads(prediction.assessment_json))

    detail = PredictionDetailResponse(
        id=prediction.id,
        prediction=DoshaPercentages(
            Vata=prediction.vata_pct,
            Pitta=prediction.pitta_pct,
            Kapha=prediction.kapha_pct,
        ),
        dominant_dosha=prediction.dominant_dosha,
        confidence=prediction.confidence,
        explanation=prediction.explanation,
        recommendations=RecommendationBlock(**json.loads(prediction.recommendations_json)),
        symptoms=prediction.symptoms,
        assessment=assessment,
        ocr_text=prediction.ocr_text,
        created_at=prediction.created_at.isoformat() if prediction.created_at else None,
    )

    settings = get_settings()
    reports_dir = settings.runtime_directories[2] / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    file_path = reports_dir / f"report_{prediction.id}.pdf"
    generate_prediction_report(detail, file_path)

    report = Report(
        user_id=user.id if user else None,
        prediction_id=prediction.id,
        file_path=str(file_path),
    )
    db.add(report)
    await db.flush()
    await db.refresh(report)

    return ReportResponse(
        id=report.id,
        prediction_id=report.prediction_id,
        download_url=f"/api/v1/reports/{report.id}/download",
        created_at=report.created_at.isoformat() if report.created_at else "",
    )


@router.get("/{report_id}/download")
async def download_report(
    report_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> FileResponse:
    report = await db.get(Report, report_id)
    if report is None:
        raise NotFoundError("Report not found")

    return FileResponse(
        path=report.file_path,
        media_type="application/pdf",
        filename=f"prakriti_report_{report.prediction_id}.pdf",
    )
