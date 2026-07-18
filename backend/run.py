import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║   🚀 CodeMentor AI v4.0 - Enterprise Edition            ║
    ║   Complete Backend with 25+ Features                    ║
    ║   🔒 Security • 🤖 AI • ⚡ Performance                  ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    print(f"📍 Server: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 API Docs: http://localhost:{settings.API_PORT}/docs")
    print(f"🤖 AI Model: {settings.DEFAULT_MODEL}")
    print(f"🌍 Languages: 20+")
    print(f"🔒 Rate Limit: {settings.MAX_REQUESTS_PER_MINUTE}/min")
    print("Press Ctrl+C to stop\n")
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )