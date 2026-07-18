from pydantic import BaseModel, Field
from typing import List, Optional
from .code import CodeIssue

class AnalysisRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Source code to analyze")
    language: str = Field("python", description="Programming language")
    auto_fix: bool = Field(False, description="Enable auto-fix generation")
    enable_ai: bool = Field(False, description="Enable AI-powered analysis")
    provider: Optional[str] = Field(None, description="AI provider to use")

class AnalysisResponse(BaseModel):
    success: bool = True
    quality_score: int = Field(..., ge=0, le=100)
    issues: List[CodeIssue] = []
    summary: str = ""
    fixed_code: Optional[str] = None
    processing_time: float = 0.0
    stats: dict = {}

class FixRequest(BaseModel):
    code: str
    language: str = "python"
    issue: dict

class FixResponse(BaseModel):
    success: bool = True
    fixed_code: str
    original_code: str
    changes_made: List[str] = []

class BatchAnalysisRequest(BaseModel):
    snippets: List[str] = Field(..., min_items=1)
    language: str = "python"
    auto_fix: bool = False

class BatchAnalysisResponse(BaseModel):
    success: bool = True
    total_snippets: int = 0
    total_issues: int = 0
    results: List[dict] = []
    processing_time: float = 0.0
    stats: dict = {}