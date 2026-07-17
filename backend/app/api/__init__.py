from fastapi import FastAPI
from .routes import router
from .websocket import router as ws_router

app = FastAPI(title="CodeMentor AI v4.0", version="4.0.0")
app.include_router(router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1")

__all__ = ['app']