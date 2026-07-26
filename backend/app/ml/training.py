"""Model training pipeline — LinearSVC + CalibratedClassifierCV (notebook baseline)."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC

from app.core.config import get_settings
from app.core.logging import get_logger
from app.ml.preprocessing import (
    balance_dataset,
    clean_and_prepare_data,
    load_and_merge_datasets,
    preprocess_text,
)

logger = get_logger(__name__)


def train_and_save(dataset_dir: Path | None = None, model_dir: Path | None = None) -> dict:
    settings = get_settings()
    dataset_dir = dataset_dir or settings.runtime_directories[0]
    model_dir = model_dir or settings.runtime_directories[1]
    model_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Loading datasets from %s", dataset_dir)
    raw_data = load_and_merge_datasets(dataset_dir)
    cleaned = clean_and_prepare_data(raw_data)
    balanced = balance_dataset(cleaned)

    balanced["Cleaned_Symptoms"] = balanced["Symptoms"].apply(preprocess_text)

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=5000,
        sublinear_tf=True,
    )
    X = vectorizer.fit_transform(balanced["Cleaned_Symptoms"])
    y = balanced["Dominant_Dosha"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    logger.info("Training LinearSVC with CalibratedClassifierCV...")
    base_svm = LinearSVC(class_weight="balanced", random_state=42, dual=False)
    model = CalibratedClassifierCV(base_svm, cv=5)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    model_path = model_dir / "model.pkl"
    vectorizer_path = model_dir / "vectorizer.pkl"
    metadata_path = model_dir / "metadata.json"

    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    metadata = {
        "accuracy": round(accuracy * 100, 2),
        "classification_report": report,
        "train_samples": int(len(y_train)),
        "test_samples": int(len(y_test)),
        "cleaned_rows": int(len(cleaned)),
        "balanced_rows": int(len(balanced)),
        "class_distribution": balanced["Dominant_Dosha"].value_counts().to_dict(),
        "model_type": "LinearSVC + CalibratedClassifierCV",
        "vectorizer": {
            "stop_words": "english",
            "ngram_range": [1, 2],
            "max_features": 5000,
            "sublinear_tf": True,
        },
    }

    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    logger.info("Model saved. Accuracy: %.2f%%", metadata["accuracy"])

    return metadata


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train Prakriti ML model")
    parser.add_argument("--dataset-dir", type=Path, default=None)
    parser.add_argument("--model-dir", type=Path, default=None)
    args = parser.parse_args()
    result = train_and_save(args.dataset_dir, args.model_dir)
    print(json.dumps(result, indent=2))
