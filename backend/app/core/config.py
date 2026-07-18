import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # AI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "deepseek/deepseek-v4-flash:free")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Rate Limiting
    MAX_REQUESTS_PER_MINUTE: int = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "60"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./codementor.db")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    
    # AI Models
    AI_PROVIDERS = {
        "openai": {
            "name": "OpenAI",
            "models": ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
            "api_key": os.getenv("OPENAI_API_KEY", "")
        },
        "deepseek": {
            "name": "DeepSeek",
            "models": ["deepseek-v4-flash:free", "deepseek-v4"],
            "api_key": os.getenv("OPENAI_API_KEY", "")
        },
        "claude": {
            "name": "Claude",
            "models": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
            "api_key": os.getenv("ANTHROPIC_API_KEY", "")
        },
        "gemini": {
            "name": "Gemini",
            "models": ["gemini-pro", "gemini-2.0-flash"],
            "api_key": os.getenv("GOOGLE_API_KEY", "")
        }
    }

settings = Settings()