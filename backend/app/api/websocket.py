"""
WebSocket support for real-time analysis
"""
import json
import logging
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.ai_service import AIService
from ..services.analyzer_service import AnalyzerService

router = APIRouter()
logger = logging.getLogger(__name__)

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()
ai_service = AIService()
analyzer = AnalyzerService()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time analysis"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received: {data}")
            
            try:
                request = json.loads(data)
                code = request.get('code', '')
                language = request.get('language', 'python')
                auto_fix = request.get('auto_fix', False)
                
                # Send processing status
                await manager.send_message(
                    json.dumps({"status": "processing", "message": "Analyzing code..."}),
                    websocket
                )
                
                # Perform analysis
                result = ai_service.analyze_code(code, language, auto_fix)
                
                # Send result
                await manager.send_message(
                    json.dumps({
                        "status": "complete",
                        "result": result
                    }),
                    websocket
                )
                
            except json.JSONDecodeError:
                await manager.send_message(
                    json.dumps({"status": "error", "message": "Invalid JSON"}),
                    websocket
                )
            except Exception as e:
                await manager.send_message(
                    json.dumps({"status": "error", "message": str(e)}),
                    websocket
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket disconnected")