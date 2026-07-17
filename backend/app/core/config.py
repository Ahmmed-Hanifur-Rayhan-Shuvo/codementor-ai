import os
from typing import List, Dict, Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CodeMentor AI v4.0"
    VERSION: str = "4.0.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://codementor.ai",
        "https://www.codementor.ai"
    ]
    
    # AI Configuration - Add these fields
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "deepseek/deepseek-v4-flash:free")
    
    # AI Models Configuration
    AI_PROVIDERS: Dict = {
        "openai": {
            "name": "OpenAI",
            "models": ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
            "api_key": os.getenv("OPENAI_API_KEY", ""),
            "base_url": "https://api.openai.com/v1"
        },
        "deepseek": {
            "name": "DeepSeek",
            "models": ["deepseek-v4-flash:free", "deepseek-v4"],
            "api_key": os.getenv("OPENAI_API_KEY", ""),
            "base_url": os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        },
        "claude": {
            "name": "Claude",
            "models": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
            "api_key": os.getenv("ANTHROPIC_API_KEY", ""),
            "base_url": "https://api.anthropic.com/v1"
        },
        "gemini": {
            "name": "Gemini",
            "models": ["gemini-pro", "gemini-2.0-flash", "gemini-2.0-pro"],
            "api_key": os.getenv("GOOGLE_API_KEY", ""),
            "base_url": "https://generativelanguage.googleapis.com/v1beta"
        }
    }
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./codementor.db")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Feature Flags
    ENABLE_WEBSOCKET: bool = True
    ENABLE_VOICE: bool = True
    ENABLE_HISTORY: bool = True
    ENABLE_TEAMS: bool = True
    ENABLE_ANALYTICS: bool = True
    ENABLE_EXPORT: bool = True
    
    # Rate Limiting
    MAX_REQUESTS_PER_MINUTE: int = 60
    MAX_CODE_LENGTH: int = 100000
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # This allows extra fields from .env
        case_sensitive = True

settings = Settings()