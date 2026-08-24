"""Prediction business logic — symptom ML + optional assessment weighting."""

from __future__ import annotations

import json

from app.ml.inference import get_model_manager
from app.ml.preprocessing import DOSHAS
from app.recommendation.engine import get_recommendations
from app.schemas.prediction import AssessmentAnswers, DoshaPercentages, PredictionResponse

SYMPTOM_WEIGHT = 0.8
ASSESSMENT_WEIGHT = 0.2

ASSESSMENT_MAP: dict[str, dict[str, str]] = {
    "body_build": {"Thin": "Vata", "Medium": "Pitta", "Heavy": "Kapha"},
    "appetite": {"Irregular": "Vata", "Strong": "Pitta", "Slow": "Kapha"},
    "sleep": {"Light": "Vata", "Moderate": "Pitta", "Deep": "Kapha"},
    "skin": {"Dry": "Vata", "Warm": "Pitta", "Oily": "Kapha"},
    "personality": {"Restless": "Vata", "Competitive": "Pitta", "Calm": "Kapha"},
}


def _assessment_probs(assessment: AssessmentAnswers | None) -> dict[str, float] | None:
    if assessment is None:
        return None

    answers = assessment.model_dump(exclude_none=True)
    if not answers:
        return None

    votes = {d: 0 for d in DOSHAS}
    for field, value in answers.items():
        mapping = ASSESSMENT_MAP.get(field, {})
        dosha = mapping.get(value)
        if dosha:
            votes[dosha] += 1

    total_votes = sum(votes.values())
    if total_votes == 0:
        return None

    return {d: round(votes[d] / total_votes * 100, 2) for d in DOSHAS}


def _normalize(probs: dict[str, float]) -> dict[str, float]:
    total = sum(probs.values())
    if total <= 0:
        return {d: round(100 / len(DOSHAS), 2) for d in DOSHAS}
    factor = 100.0 / total
    return {k: round(v * factor, 2) for k, v in probs.items()}


def _blend(
    ml_probs: dict[str, float],
    assessment_probs: dict[str, float] | None,
) -> dict[str, float]:
    if assessment_probs is None:
        return ml_probs

    blended = {
        d: SYMPTOM_WEIGHT * ml_probs[d] + ASSESSMENT_WEIGHT * assessment_probs[d]
        for d in DOSHAS
    }
    return _normalize(blended)


def _build_explanation(
    dominant_dosha: str,
    highest_dosha: str,
    second_dosha: str,
    is_blend: bool,
    probs: dict[str, float],
    assessment: AssessmentAnswers | None,
    symptoms: str,
    ocr_text: str | None = None,
) -> str:
    symptom_clean = symptoms.strip()
    if len(symptom_clean) > 100:
        symptom_snippet = symptom_clean[:97] + "..."
    else:
        symptom_snippet = symptom_clean

    if is_blend:
        parts = [
            f"Based on symptom language analysis, your reported symptoms ('{symptom_snippet}') "
            f"indicate a dual-dosha {dominant_dosha} constitution, showing a close balance between "
            f"{highest_dosha} ({probs[highest_dosha]:.1f}%) and {second_dosha} ({probs[second_dosha]:.1f}%)."
        ]
    else:
        parts = [
            f"Based on symptom language analysis, your reported symptoms ('{symptom_snippet}') "
            f"indicate a dominant {highest_dosha} pattern ({probs[highest_dosha]:.1f}% majority)."
        ]

    if ocr_text and ocr_text.strip():
        ocr_clean = ocr_text.strip()
        if len(ocr_clean) > 100:
            ocr_snippet = ocr_clean[:97] + "..."
        else:
            ocr_snippet = ocr_clean
        parts.append(
            f"The analysis also integrated information from your uploaded prescription ('{ocr_snippet}'), "
            f"corroborating the overall constitutional balance."
        )

    if assessment and assessment.model_dump(exclude_none=True):
        parts.append(
            "Optional constitutional assessment responses were incorporated at 20% weight "
            "to refine the prediction alongside symptom analysis (80%)."
        )
    else:
        parts.append(
            "This prediction is based entirely on symptom analysis, as no assessment was provided."
        )

    if not is_blend:
        parts.append(
            f"Your secondary influence is {second_dosha} at {probs[second_dosha]:.1f}%, "
            f"suggesting a {highest_dosha}-{second_dosha} prakriti blend."
        )
    return " ".join(parts)


def run_prediction(
    symptoms: str,
    assessment: AssessmentAnswers | None = None,
    ocr_text: str | None = None,
) -> PredictionResponse:
    combined_text = symptoms.strip()
    if ocr_text and ocr_text.strip():
        combined_text = f"{combined_text} {ocr_text.strip()}"

    manager = get_model_manager()
    ml_probs = manager.predict_symptoms(combined_text)
    assessment_probs = _assessment_probs(assessment)
    final_probs = _blend(ml_probs, assessment_probs)

    # Sort final probabilities in descending order to identify top doshas
    sorted_doshas = sorted(final_probs.items(), key=lambda x: x[1], reverse=True)
    highest_dosha, highest_pct = sorted_doshas[0]
    second_dosha, second_pct = sorted_doshas[1]

    diff = highest_pct - second_pct
    is_blend = diff <= 10.0

    if is_blend:
        # Determine canonical name for the dual-dosha blend
        doshas_in_blend = {highest_dosha, second_dosha}
        if {"Vata", "Pitta"}.issubset(doshas_in_blend):
            dominant = "Vata-Pitta Blend"
        elif {"Vata", "Kapha"}.issubset(doshas_in_blend):
            dominant = "Vata-Kapha Blend"
        else:
            dominant = "Pitta-Kapha Blend"
    else:
        dominant = highest_dosha

    confidence = highest_pct
    recommendations = get_recommendations(dominant)
    explanation = _build_explanation(
        dominant_dosha=dominant,
        highest_dosha=highest_dosha,
        second_dosha=second_dosha,
        is_blend=is_blend,
        probs=final_probs,
        assessment=assessment,
        symptoms=symptoms,
        ocr_text=ocr_text,
    )

    return PredictionResponse(
        prediction=DoshaPercentages(**final_probs),
        dominant_dosha=dominant,
        confidence=confidence,
        explanation=explanation,
        recommendations=recommendations,
    )


def assessment_to_json(assessment: AssessmentAnswers | None) -> str | None:
    if assessment is None:
        return None
    data = assessment.model_dump(exclude_none=True)
    return json.dumps(data) if data else None
