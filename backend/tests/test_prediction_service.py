"""Prediction service unit tests."""

from app.schemas.prediction import AssessmentAnswers
from app.services.prediction_service import _assessment_probs, _blend, _normalize


def test_assessment_probs_none_when_empty():
    assert _assessment_probs(None) is None
    assert _assessment_probs(AssessmentAnswers()) is None


def test_assessment_probs_vata_dominant():
    assessment = AssessmentAnswers(
        body_build="Thin",
        appetite="Irregular",
        sleep="Light",
        skin="Dry",
        personality="Restless",
    )
    probs = _assessment_probs(assessment)
    assert probs is not None
    assert probs["Vata"] == 100.0


def test_blend_without_assessment():
    ml = {"Vata": 90.0, "Pitta": 5.0, "Kapha": 5.0}
    assert _blend(ml, None) == ml


def test_blend_with_assessment():
    ml = {"Vata": 80.0, "Pitta": 10.0, "Kapha": 10.0}
    assessment = {"Vata": 100.0, "Pitta": 0.0, "Kapha": 0.0}
    blended = _blend(ml, assessment)
    assert blended["Vata"] > ml["Vata"] - 1  # should stay high
    assert abs(sum(blended.values()) - 100.0) < 0.1


def test_normalize():
    probs = {"Vata": 50.0, "Pitta": 30.0, "Kapha": 20.0}
    normalized = _normalize(probs)
    assert abs(sum(normalized.values()) - 100.0) < 0.01


def test_build_explanation_blend():
    from app.services.prediction_service import _build_explanation
    probs = {"Vata": 45.0, "Pitta": 42.0, "Kapha": 13.0}
    exp = _build_explanation(
        dominant_dosha="Vata-Pitta Blend",
        highest_dosha="Vata",
        second_dosha="Pitta",
        is_blend=True,
        probs=probs,
        assessment=None,
        symptoms="Dryness and anxiety",
        ocr_text=None,
    )
    assert "Vata-Pitta Blend" in exp
    assert "45.0%" in exp
    assert "42.0%" in exp
    assert "dual-dosha" in exp
