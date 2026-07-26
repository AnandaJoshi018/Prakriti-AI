"""PDF report generation tests."""

from pathlib import Path

import fitz

from app.pdf.report_generator import generate_prediction_report
from app.schemas.prediction import AssessmentAnswers, DoshaPercentages, PredictionDetailResponse, RecommendationBlock


def test_generate_prediction_report_contains_required_sections(tmp_path: Path) -> None:
    data = PredictionDetailResponse(
        prediction=DoshaPercentages(Vata=50.0, Pitta=30.0, Kapha=20.0),
        dominant_dosha="Vata",
        confidence=88.5,
        explanation="A balanced but Vata-lean constitution with strong mobility and sensitivity.",
        recommendations=RecommendationBlock(
            diet="Favor warm soups and cooked grains.",
            foods_to_eat="Root vegetables, oats, and ghee.",
            foods_to_avoid="Raw salads and cold drinks.",
            herbs="Ashwagandha and ginger.",
            yoga="Gentle restorative yoga.",
            lifestyle="Keep a steady routine and avoid overstimulation.",
            daily_routine="Wake up consistently and hydrate well.",
            morning_routine="Wake up early and apply warm oil.",
            evening_routine="Warm oil massage and screen-free wind-down.",
            hydration="Sip warm water through the day.",
            sleep="Prioritize regular sleep and wind-down rituals.",
            mental_hygiene="Practice slow breathing and mindfulness.",
            stress_management="Practice breathwork and grounding meditation.",
            wellness_tips="Stay warm and maintain a steady schedule.",
        ),
        symptoms="Dry skin, anxiety, and irregular digestion",
        assessment=AssessmentAnswers(body_build="Thin", appetite="Irregular"),
        ocr_text="Take Ashwagandha twice daily with warm milk",
        ocr_filename="prescription.pdf",
        created_at="2026-01-01T00:00:00",
    )

    output_path = tmp_path / "report.pdf"
    generate_prediction_report(data, output_path)

    assert output_path.exists()
    document = fitz.open(output_path)
    text = "\n".join(page.get_text() for page in document)
    assert "Prakriti AI" in text
    assert "Vata" in text
    assert "Timestamp" in text
    document.close()
