"""Prediction request and response schemas."""

from pydantic import BaseModel, Field


class AssessmentAnswers(BaseModel):
    body_build: str | None = None
    appetite: str | None = None
    sleep: str | None = None
    skin: str | None = None
    personality: str | None = None


class PredictionRequest(BaseModel):
    symptoms: str = Field(min_length=3, max_length=5000)
    assessment: AssessmentAnswers | None = None
    ocr_text: str | None = None
    ocr_filename: str | None = None


class DoshaPercentages(BaseModel):
    Vata: float
    Pitta: float
    Kapha: float


class RecommendationBlock(BaseModel):
    diet: str
    foods_to_eat: str
    foods_to_avoid: str
    herbs: str
    yoga: str
    lifestyle: str
    daily_routine: str
    morning_routine: str
    evening_routine: str
    hydration: str
    sleep: str
    mental_hygiene: str
    stress_management: str
    wellness_tips: str


class PredictionResponse(BaseModel):
    id: int | None = None
    prediction: DoshaPercentages
    dominant_dosha: str
    confidence: float
    explanation: str
    recommendations: RecommendationBlock


class PredictionDetailResponse(PredictionResponse):
    symptoms: str
    assessment: AssessmentAnswers | None = None
    ocr_text: str | None = None
    ocr_filename: str | None = None
    created_at: str | None = None
