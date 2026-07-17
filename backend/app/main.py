from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import your routes
from .api.routes import router
from .api.websocket import router as ws_router
from .core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "environment": os.getenv("VERCEL_ENV", "development")
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "api_configured": bool(settings.OPENAI_API_KEY),
        "model": settings.DEFAULT_MODEL
    }

# For Vercel serverless
def handler(request):
    return app(request)