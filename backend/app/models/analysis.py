from pydantic import BaseModel
from typing import List, Optional
from .code import CodeIssue

class AnalysisRequest(BaseModel):
    """Request for code analysis"""
    code: str
    language: str
    auto_fix: bool = False
    provider: Optional[str] = None
    model: Optional[str] = None

class AnalysisResponse(BaseModel):
    """Response from code analysis"""
    success: bool = True
    quality_score: int
    issues: List[CodeIssue]
    summary: str
    fixed_code: Optional[str] = None
    processing_time: float = 0.0
    model_used: Optional[str] = None
    provider: Optional[str] = None
    stats: dict = {}

class FixRequest(BaseModel):
    """Request to fix code"""
    code: str
    language: str
    issue: dict
    provider: Optional[str] = None

class FixResponse(BaseModel):
    """Response from code fix"""
    success: bool
    fixed_code: str
    original_code: str
    changes_made: List[str] = []