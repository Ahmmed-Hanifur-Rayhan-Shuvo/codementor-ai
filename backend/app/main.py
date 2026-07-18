from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.routes import router
from .api.websocket import router as ws_router
from .core.config import settings
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CodeMentor AI",
    description="Enterprise-Grade Intelligent Code Analysis & Auto-Fix Platform",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://codementor-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include routers with prefix
app.include_router(router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "CodeMentor AI",
        "version": "4.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/v1/health",
        "features": [
            "Static Code Analysis (12+ languages)",
            "AI-Powered Analysis",
            "Auto-Fix Generation",
            "Security Detection",
            "Performance Analysis",
            "Quality Score (0-100)",
            "WebSocket Support",
            "Batch Analysis",
            "Rate Limiting"
        ]
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "Please try again later"
        }
    )