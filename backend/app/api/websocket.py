from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import time
from typing import List
from ..services.analyzer_service import AnalyzerService

router = APIRouter()
analyzer = AnalyzerService()

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

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            request = json.loads(data)
            
            issues, score = analyzer.analyze(
                request.get("code", ""),
                request.get("language", "python")
            )
            
            await manager.send_message(
                json.dumps({
                    "type": "analysis_result",
                    "quality_score": score,
                    "issues": [i.dict() for i in issues],
                    "summary": f"Found {len(issues)} issues"
                }),
                websocket
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)