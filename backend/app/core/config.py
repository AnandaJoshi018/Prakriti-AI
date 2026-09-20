"""Environment-backed application configuration."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime settings loaded from environment variables and an optional .env file."""

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Prakriti AI API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    host: str = "127.0.0.1"
    port: int = Field(default=8000, ge=1, le=65535)
    log_level: str = "INFO"
    json_logs: bool = False

    api_v1_prefix: str = "/api/v1"
    docs_enabled: bool = True
    cors_origins: str = "http://localhost:5173"

    database_url: str = "sqlite:///./prakriti_ai.db"
    jwt_secret_key: str | None = None
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=60, ge=1, le=43_200)
    google_client_id: str | None = None

    dataset_dir: Path = Path("datasets")
    model_dir: Path = Path("trained_models")
    upload_dir: Path = Path("uploads")
    max_upload_size_mb: int = Field(default=10, ge=1, le=50)

    @field_validator("environment")
    @classmethod
    def normalize_environment(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("log_level")
    @classmethod
    def normalize_log_level(cls, value: str) -> str:
        return value.strip().upper()

    @property
    def cors_origins_list(self) -> list[str]:
        """Convert a comma-separated environment value into CORS origins."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def runtime_directories(self) -> tuple[Path, Path, Path]:
        """Return storage directories as absolute paths under the backend root."""
        return tuple(
            directory if directory.is_absolute() else BACKEND_DIR / directory
            for directory in (self.dataset_dir, self.model_dir, self.upload_dir)
        )

    def ensure_runtime_directories(self) -> None:
        """Create non-secret local storage locations needed by later modules."""
        for directory in self.runtime_directories:
            directory.mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    """Return one immutable settings object per process."""
    return Settings()
