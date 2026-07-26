"""Async SQLAlchemy database engine and session management."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import BACKEND_DIR, get_settings


def _to_async_url(url: str) -> str:
    """Convert a sync SQLAlchemy URL to its async equivalent."""
    if url.startswith("sqlite:///"):
        db_path = url.replace("sqlite:///", "", 1)
        if not db_path.startswith("/") and ":" not in db_path[:3]:
            db_path = str(BACKEND_DIR / db_path)
        return f"sqlite+aiosqlite:///{db_path}"
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


class Base(DeclarativeBase):
    pass


settings = get_settings()
engine = create_async_engine(_to_async_url(settings.database_url), echo=settings.debug)
async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            from sqlalchemy import text
            await conn.execute(text("ALTER TABLE predictions ADD COLUMN ocr_filename TEXT;"))
        except Exception:
            pass
