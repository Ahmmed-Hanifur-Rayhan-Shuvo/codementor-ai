from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class IssueType(str, Enum):
    SECURITY = "security"
    PERFORMANCE = "performance"
    CODE_QUALITY = "code_quality"
    BUG = "bug"
    MAINTAINABILITY = "maintainability"
    BEST_PRACTICE = "best_practice"
    AI = "ai_detected"

class CodeIssue(BaseModel):
    message: str = Field(..., description="Description of the issue")
    severity: Severity = Field(..., description="Severity level")
    line: int = Field(0, description="Line number where issue occurs")
    column: int = Field(0, description="Column number where issue occurs")
    suggestion: str = Field(..., description="How to fix the issue")
    type: IssueType = Field(IssueType.CODE_QUALITY, description="Type of issue")
    fixed_code: Optional[str] = Field(None, description="Fixed code snippet")
    rule_id: Optional[str] = Field(None, description="Rule identifier")
    category: Optional[str] = Field(None, description="Issue category")