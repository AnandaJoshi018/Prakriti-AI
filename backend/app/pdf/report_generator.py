"""ReportLab PDF report generation."""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.schemas.prediction import PredictionDetailResponse


def generate_prediction_report(data: PredictionDetailResponse, output_path: Path) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(output_path), pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title", parent=styles["Heading1"], fontSize=20, spaceAfter=12, textColor=colors.HexColor("#1B4332"))
    heading_style = ParagraphStyle("Heading", parent=styles["Heading2"], fontSize=14, spaceAfter=8, textColor=colors.HexColor("#2D6A4F"))
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=6)

    elements: list = []
    elements.append(Paragraph("Prakriti AI — Dosha Analysis Report", title_style))
    elements.append(Paragraph(f"Generated: {datetime.now(UTC).strftime('%Y-%m-%d %H:%M UTC')}", body_style))
    elements.append(Spacer(1, 0.5 * cm))

    elements.append(Paragraph("User Inputs", heading_style))
    elements.append(Paragraph(f"<b>Symptoms:</b> {data.symptoms}", body_style))
    if data.assessment:
        assessment_text = ", ".join(
            f"{k}: {v}" for k, v in data.assessment.model_dump(exclude_none=True).items()
        )
        elements.append(Paragraph(f"<b>Assessment:</b> {assessment_text or 'Not provided'}", body_style))
    if data.ocr_text:
        elements.append(Paragraph(f"<b>OCR Extracted Text:</b> {data.ocr_text[:500]}", body_style))
    elements.append(Spacer(1, 0.3 * cm))

    elements.append(Paragraph("Dosha Analysis", heading_style))
    dosha_table = Table(
        [
            ["Dosha", "Percentage"],
            ["Vata", f"{data.prediction.Vata}%"],
            ["Pitta", f"{data.prediction.Pitta}%"],
            ["Kapha", f"{data.prediction.Kapha}%"],
        ],
        colWidths=[8 * cm, 6 * cm],
    )
    dosha_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2D6A4F")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F0F4EF")]),
        ])
    )
    elements.append(dosha_table)
    elements.append(Spacer(1, 0.3 * cm))
    elements.append(Paragraph(f"<b>Primary Constitution:</b> {data.dominant_dosha}", body_style))
    elements.append(Paragraph(f"<b>Percentage:</b> {data.confidence}%", body_style))
    elements.append(Spacer(1, 0.3 * cm))

    elements.append(Paragraph("AI Explanation", heading_style))
    elements.append(Paragraph(data.explanation, body_style))
    elements.append(Spacer(1, 0.3 * cm))

    elements.append(Paragraph("Timestamp", heading_style))
    elements.append(Paragraph(data.created_at or datetime.now(UTC).strftime('%Y-%m-%d %H:%M UTC'), body_style))
    elements.append(Spacer(1, 0.3 * cm))

    elements.append(Paragraph("Personalized Recommendations", heading_style))
    rec = data.recommendations
    for label, value in rec.model_dump().items():
        elements.append(Paragraph(f"<b>{label.replace('_', ' ').title()}:</b> {value}", body_style))

    doc.build(elements)
    return output_path
