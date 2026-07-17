import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print("""
    ╔═══════════════════════════════════════════════════════╗
    ║   🚀 CodeMentor AI v4.0 - Enterprise Edition        ║
    ║   Intelligent Code Analysis & Auto-Fix Platform     ║
    ║   🌍 Global Ready • 2030+ Compatible               ║
    ╚═══════════════════════════════════════════════════════╝
    """)
    print(f"📍 Server: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 API Docs: http://localhost:{settings.API_PORT}/docs")
    print(f"🤖 Model: deepseek/deepseek-v4-flash:free")
    print(f"🌍 Supported Languages: 20+")
    print("Press Ctrl+C to stop\n")
    
    uvicorn.run(
        "app.main:app",  # main.py থেকে app
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )