"""Recommendation engine — loads versioned Ayurvedic rules."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.schemas.prediction import RecommendationBlock

RULES_PATH = Path(__file__).resolve().parent / "rules_v1.json"


@lru_cache(maxsize=1)
def _load_rules() -> dict:
    return json.loads(RULES_PATH.read_text(encoding="utf-8"))


def get_recommendations(dominant_dosha: str) -> RecommendationBlock:
    rules = _load_rules()
    dosha_rules = rules["doshas"].get(dominant_dosha)
    if not dosha_rules:
        dosha_rules = rules["doshas"]["Vata"]
    return RecommendationBlock(**dosha_rules)
