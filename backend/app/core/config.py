from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and `.env`."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "Micro-Inventory Sync API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./inventory.db",
        description="Async SQLAlchemy database URL.",
    )
    GEMINI_API_KEY: str = Field(
        default="",
        description="Google Gemini API key for AI-powered chat parsing.",
    )
    INSTAGRAM_WEBHOOK_VERIFY_TOKEN: str = Field(
        default="",
        description="Token used to verify Instagram webhook subscriptions.",
    )

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
