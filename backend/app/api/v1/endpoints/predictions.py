"""Prediction endpoints."""

from __future__ import annotations

import json
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user, get_current_user_optional
from app.core.database import get_db
from app.core.exceptions import NotFoundError
from app.models import Prediction, User
from app.schemas.prediction import (
    AssessmentAnswers,
    DoshaPercentages,
    PredictionDetailResponse,
    PredictionRequest,
    PredictionResponse,
    RecommendationBlock,
)
from app.services.prediction_service import assessment_to_json, run_prediction

router = APIRouter()


@router.get("", response_model=list[PredictionDetailResponse])
async def list_predictions(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User | None, Depends(get_current_user_optional)],
) -> list[PredictionDetailResponse]:
    if user is None:
        return []

    result = await db.execute(
        select(Prediction)
        .where(Prediction.user_id == user.id)
        .order_by(Prediction.created_at.desc())
    )
    predictions = result.scalars().all()

    return [
        PredictionDetailResponse(
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
            assessment=AssessmentAnswers(**json.loads(prediction.assessment_json)) if prediction.assessment_json else None,
            ocr_text=prediction.ocr_text,
            ocr_filename=prediction.ocr_filename,
            created_at=prediction.created_at.isoformat() if prediction.created_at else None,
        )
        for prediction in predictions
    ]


@router.post("", response_model=PredictionResponse, status_code=201)
async def create_prediction(
    payload: PredictionRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User | None, Depends(get_current_user_optional)],
) -> PredictionResponse:
    result = run_prediction(payload.symptoms, payload.assessment, payload.ocr_text)

    prediction = Prediction(
        user_id=user.id if user else None,
        symptoms=payload.symptoms,
        assessment_json=assessment_to_json(payload.assessment),
        ocr_text=payload.ocr_text,
        ocr_filename=payload.ocr_filename,
        vata_pct=result.prediction.Vata,
        pitta_pct=result.prediction.Pitta,
        kapha_pct=result.prediction.Kapha,
        dominant_dosha=result.dominant_dosha,
        confidence=result.confidence,
        explanation=result.explanation,
        recommendations_json=result.recommendations.model_dump_json(),
    )
    db.add(prediction)
    await db.flush()
    await db.refresh(prediction)

    result.id = prediction.id
    return result


@router.get("/history", response_model=list[PredictionDetailResponse])
async def list_history(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[PredictionDetailResponse]:
    result = await db.execute(
        select(Prediction)
        .where(Prediction.user_id == user.id)
        .order_by(Prediction.created_at.desc())
    )
    predictions = result.scalars().all()

    return [
        PredictionDetailResponse(
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
            assessment=AssessmentAnswers(**json.loads(prediction.assessment_json)) if prediction.assessment_json else None,
            ocr_text=prediction.ocr_text,
            ocr_filename=prediction.ocr_filename,
            created_at=prediction.created_at.isoformat() if prediction.created_at else None,
        )
        for prediction in predictions
    ]


@router.get("/{prediction_id}", response_model=PredictionDetailResponse)
async def get_prediction(
    prediction_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PredictionDetailResponse:
    prediction = await db.get(Prediction, prediction_id)
    if prediction is None:
        raise NotFoundError("Prediction not found")

    assessment = None
    if prediction.assessment_json:
        assessment = AssessmentAnswers(**json.loads(prediction.assessment_json))

    return PredictionDetailResponse(
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
        ocr_filename=prediction.ocr_filename,
        created_at=prediction.created_at.isoformat() if prediction.created_at else None,
    )
