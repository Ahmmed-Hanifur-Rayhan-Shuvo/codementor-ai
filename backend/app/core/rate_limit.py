import time
from collections import defaultdict
from typing import Dict, List
from .config import settings

class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, List[float]] = defaultdict(list)
        self.max_requests = settings.MAX_REQUESTS_PER_MINUTE
        self.window = 60
    
    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        window_start = now - self.window
        
        # Clean old requests
        self.requests[client_id] = [
            t for t in self.requests[client_id] if t > window_start
        ]
        
        # Check limit
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        self.requests[client_id].append(now)
        return True
    
    def get_remaining(self, client_id: str) -> int:
        now = time.time()
        window_start = now - self.window
        
        self.requests[client_id] = [
            t for t in self.requests[client_id] if t > window_start
        ]
        
        return max(0, self.max_requests - len(self.requests[client_id]))
    
    def reset(self, client_id: str):
        if client_id in self.requests:
            self.requests[client_id] = []
    
    def limit(self, requests: int = 60, window: int = 60):
        def decorator(func):
            async def wrapper(*args, **kwargs):
                # Get client IP from request
                request = kwargs.get('request') or args[0] if args else None
                client_id = request.client.host if request and hasattr(request, 'client') else "unknown"
                
                now = time.time()
                window_start = now - window
                
                # Clean old requests
                self.requests[client_id] = [
                    t for t in self.requests[client_id] if t > window_start
                ]
                
                if len(self.requests[client_id]) >= requests:
                    from fastapi import HTTPException
                    raise HTTPException(429, "Rate limit exceeded")
                
                self.requests[client_id].append(now)
                return await func(*args, **kwargs)
            return wrapper
        return decorator