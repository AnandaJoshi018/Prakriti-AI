"""Model loading and inference."""

from __future__ import annotations

import json
from pathlib import Path

import joblib

from app.core.config import get_settings
from app.core.exceptions import ModelNotLoadedError
from app.core.logging import get_logger
from app.ml.preprocessing import DOSHAS, preprocess_text

logger = get_logger(__name__)


class ModelManager:
    """Singleton manager for ML artifacts."""

    def __init__(self) -> None:
        self._model = None
        self._vectorizer = None
        self._metadata: dict | None = None
        self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def metadata(self) -> dict | None:
        return self._metadata

    def load(self) -> None:
        settings = get_settings()
        model_dir = settings.runtime_directories[1]
        model_path = model_dir / "model.pkl"
        vectorizer_path = model_dir / "vectorizer.pkl"
        metadata_path = model_dir / "metadata.json"

        if not model_path.exists() or not vectorizer_path.exists():
            raise FileNotFoundError(f"Model artifacts not found in {model_dir}")

        self._model = joblib.load(model_path)
        self._vectorizer = joblib.load(vectorizer_path)
        if metadata_path.exists():
            self._metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        self._loaded = True
        logger.info("Loaded ML artifacts from %s", model_dir)

    def predict_symptoms(self, symptom_text: str) -> dict[str, float]:
        if not self._loaded or self._model is None or self._vectorizer is None:
            raise ModelNotLoadedError()

        cleaned = preprocess_text(symptom_text)
        vec = self._vectorizer.transform([cleaned])
        probs = self._model.predict_proba(vec)[0]
        classes = self._model.classes_

        prob_dict = {cls: prob * 100 for cls, prob in zip(classes, probs, strict=False)}
        final_probs = {d: round(prob_dict.get(d, 0.0), 2) for d in DOSHAS}

        total = sum(final_probs.values())
        if total > 0:
            factor = 100.0 / total
            final_probs = {k: round(v * factor, 2) for k, v in final_probs.items()}

        return final_probs


_manager: ModelManager | None = None


def get_model_manager() -> ModelManager:
    global _manager
    if _manager is None:
        _manager = ModelManager()
    return _manager
