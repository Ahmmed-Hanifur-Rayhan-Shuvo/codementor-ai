from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class Severity(str, Enum):
    """Severity levels for code issues"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class IssueType(str, Enum):
    """Types of code issues"""
    SECURITY = "security"
    PERFORMANCE = "performance"
    CODE_QUALITY = "code_quality"
    BUG = "bug"
    MAINTAINABILITY = "maintainability"
    BEST_PRACTICE = "best_practice"

class CodeIssue(BaseModel):
    """Individual code issue model"""
    message: str
    severity: Severity
    line: int = 0
    column: int = 0
    suggestion: str
    fixed_code: Optional[str] = None
    type: IssueType = IssueType.CODE_QUALITY
    category: Optional[str] = None
    rule_id: Optional[str] = None

class CodeAnalysis(BaseModel):
    """Complete code analysis result"""
    quality_score: int
    issues: List[CodeIssue]
    summary: str
    fixed_code: Optional[str] = None
    processing_time: float = 0.0
    model_used: Optional[str] = None
    provider: Optional[str] = None
    language: Optional[str] = None
    lines_count: Optional[int] = None