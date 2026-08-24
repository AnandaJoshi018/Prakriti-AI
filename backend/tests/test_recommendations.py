"""Recommendation engine tests."""

from app.recommendation.engine import get_recommendations


def test_vata_recommendations():
    rec = get_recommendations("Vata")
    assert "warm" in rec.diet.lower()
    assert rec.herbs
    assert rec.yoga


def test_pitta_recommendations():
    rec = get_recommendations("Pitta")
    assert "cool" in rec.diet.lower() or "cooling" in rec.diet.lower()


def test_kapha_recommendations():
    rec = get_recommendations("Kapha")
    assert rec.lifestyle
    assert rec.stress_management


def test_vata_pitta_recommendations():
    rec = get_recommendations("Vata-Pitta Blend")
    assert rec.diet
    assert rec.herbs
    assert rec.yoga


def test_vata_kapha_recommendations():
    rec = get_recommendations("Vata-Kapha Blend")
    assert rec.diet
    assert rec.herbs
    assert rec.yoga


def test_pitta_kapha_recommendations():
    rec = get_recommendations("Pitta-Kapha Blend")
    assert rec.diet
    assert rec.herbs
    assert rec.yoga
