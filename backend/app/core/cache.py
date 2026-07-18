import hashlib
import json
from typing import Any, Optional
from .config import settings

class Cache:
    def __init__(self):
        self._cache = {}
        self._ttl = {}
    
    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            if self._ttl.get(key, 0) > time.time():
                return self._cache[key]
            else:
                del self._cache[key]
                del self._ttl[key]
        return None
    
    def set(self, key: str, value: Any, ttl: int = 300):
        self._cache[key] = value
        self._ttl[key] = time.time() + ttl
    
    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]
        if key in self._ttl:
            del self._ttl[key]
    
    def clear(self):
        self._cache.clear()
        self._ttl.clear()
    
    def get_key(self, *args, **kwargs) -> str:
        data = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True)
        return hashlib.md5(data.encode()).hexdigest()

cache = Cache()