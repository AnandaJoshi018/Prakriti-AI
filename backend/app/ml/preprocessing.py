"""Data loading, cleaning, and text preprocessing — ported from Prakriti_Prediction.ipynb."""

from __future__ import annotations

import re
from pathlib import Path

import pandas as pd
from sklearn.utils import resample

REQUIRED_COLS = ["Symptoms", "Vata", "Pitta", "Kapha"]
DOSHAS = ["Vata", "Pitta", "Kapha"]


def load_and_merge_datasets(dataset_dir: Path) -> pd.DataFrame:
    """Load all CSV/Excel datasets from a directory and merge them."""
    dataframes: list[pd.DataFrame] = []
    patterns = ["*.csv", "*.xlsx", "*.xls"]

    for pattern in patterns:
        for file_path in sorted(dataset_dir.glob(pattern)):
            if file_path.suffix.lower() == ".csv":
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            dataframes.append(df)

    if not dataframes:
        raise FileNotFoundError(f"No datasets found in {dataset_dir}")

    return pd.concat(dataframes, ignore_index=True)


def clean_and_prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean data, standardize columns, and remove noise."""
    col_mapping = {col: col.strip().capitalize() for col in df.columns}
    df = df.rename(columns=col_mapping)

    for col in REQUIRED_COLS:
        if col not in df.columns:
            alt_col = [c for c in df.columns if c.lower() == col.lower()]
            if alt_col:
                df = df.rename(columns={alt_col[0]: col})
            else:
                raise KeyError(f"Required column '{col}' missing from datasets.")

    df = df[REQUIRED_COLS].copy()
    df = df.dropna()
    df = df.drop_duplicates(subset=["Symptoms"])

    for col in ["Vata", "Pitta", "Kapha"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df = df[~((df["Vata"] == df["Pitta"]) & (df["Pitta"] == df["Kapha"]))]
    df = df[~((df["Vata"] == 0) & (df["Pitta"] == 0) & (df["Kapha"] == 0))]
    df["Dominant_Dosha"] = df[["Vata", "Pitta", "Kapha"]].idxmax(axis=1)
    return df


def balance_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Balance the dataset using upsampling to match the majority class."""
    max_size = df["Dominant_Dosha"].value_counts().max()
    dfs: list[pd.DataFrame] = []
    for dosha in df["Dominant_Dosha"].unique():
        dosha_df = df[df["Dominant_Dosha"] == dosha]
        dosha_resampled = resample(
            dosha_df,
            replace=True,
            n_samples=max_size,
            random_state=42,
        )
        dfs.append(dosha_resampled)
    return pd.concat(dfs).sample(frac=1, random_state=42).reset_index(drop=True)


def preprocess_text(text: str) -> str:
    """Clean text for TF-IDF processing."""
    text = str(text).lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text.strip()
