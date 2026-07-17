"""
Main API Routes for CodeMentor AI
"""
import time
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.database import get_db
from ..services.ai_service import AIService
from ..services.analyzer_service import AnalyzerService
from ..services.fix_service import FixService
from ..models.code import CodeIssue, Severity
from ..models.analysis import AnalysisRequest, AnalysisResponse, FixRequest, FixResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
ai_service = AIService()
analyzer = AnalyzerService()
fix_service = FixService()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "project": settings.PROJECT_NAME,
        "available_models": list(settings.AI_PROVIDERS.keys()),
        "supported_languages": analyzer.get_supported_languages(),
        "timestamp": time.time()
    }

@router.get("/languages")
async def get_languages():
    """Get all supported languages"""
    return {
        "languages": analyzer.LANGUAGES,
        "total": len(analyzer.LANGUAGES)
    }

@router.get("/models")
async def get_models():
    """Get available AI models"""
    return {
        "providers": settings.AI_PROVIDERS,
        "current": ai_service.provider,
        "available": ai_service.get_available_providers()
    }

@router.post("/models/switch")
async def switch_model(provider: str):
    """Switch AI provider"""
    try:
        success = ai_service.switch_provider(provider)
        if success:
            return {"status": "success", "provider": provider}
        else:
            raise HTTPException(status_code=400, detail="Provider not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_code(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze code with both static and AI analysis
    """
    try:
        start_time = time.time()
        logger.info(f"Analyzing {request.language} code ({len(request.code)} chars)")
        
        # Validate code length
        if len(request.code) > settings.MAX_CODE_LENGTH:
            raise HTTPException(status_code=400, detail="Code too large")
        
        # Switch provider if specified
        if request.provider and request.provider in settings.AI_PROVIDERS:
            ai_service.switch_provider(request.provider)
        
        # Static Analysis
        static_issues = analyzer.analyze(request.code, request.language)
        logger.info(f"Static analysis found {len(static_issues)} issues")
        
        # AI Analysis
        ai_result = ai_service.analyze_code(
            request.code,
            request.language,
            request.auto_fix
        )
        logger.info(f"AI analysis: score={ai_result.get('quality_score')}")
        
        # Combine issues
        combined_issues = []
        seen_messages = set()
        
        # Add static issues
        for issue in static_issues:
            if issue.message not in seen_messages:
                combined_issues.append(issue)
                seen_messages.add(issue.message)
        
        # Add AI issues
        for ai_issue in ai_result.get('issues', []):
            message = ai_issue.get('message', '')
            if message and message not in seen_messages:
                combined_issues.append(CodeIssue(
                    message=message,
                    severity=ai_issue.get('severity', 'low'),
                    line=ai_issue.get('line', 0),
                    suggestion=ai_issue.get('suggestion', ''),
                    fixed_code=ai_issue.get('fixed_code')
                ))
                seen_messages.add(message)
        
        # Calculate quality score
        quality_score = ai_result.get('quality_score', 70)
        if len(combined_issues) > 5:
            quality_score = max(0, quality_score - 10)
        elif len(combined_issues) == 0:
            quality_score = 100
        
        # Generate fixed code
        fixed_code = ai_result.get('fixed_code')
        if not fixed_code and request.auto_fix and combined_issues:
            fixed_code = ai_service.fix_code(
                request.code,
                request.language,
                {"message": "Fix all issues", "suggestion": "Apply all fixes"}
            )
        
        # Prepare response
        response = AnalysisResponse(
            success=True,
            quality_score=min(100, max(0, quality_score)),
            issues=combined_issues,
            summary=ai_result.get('summary', f"Found {len(combined_issues)} issues"),
            fixed_code=fixed_code,
            processing_time=time.time() - start_time,
            model_used=ai_result.get('model_used'),
            provider=ai_result.get('provider', ai_service.provider),
            stats={
                "total_issues": len(combined_issues),
                "static_issues": len(static_issues),
                "ai_issues": len(ai_result.get('issues', [])),
                "auto_fix_enabled": request.auto_fix,
                "has_fixes": any(i.fixed_code for i in combined_issues)
            }
        )
        
        logger.info(f"Analysis complete in {response.processing_time:.2f}s")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fix", response_model=FixResponse)
async def fix_code(request: FixRequest):
    """
    Fix a specific code issue
    """
    try:
        logger.info(f"Fixing issue: {request.issue.get('message')}")
        
        fixed_code = ai_service.fix_code(
            request.code,
            request.language,
            request.issue
        )
        
        return FixResponse(
            success=True,
            fixed_code=fixed_code,
            original_code=request.code,
            changes_made=["Applied AI-generated fix"]
        )
        
    except Exception as e:
        logger.error(f"Fix failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/static")
async def analyze_static(request: AnalysisRequest):
    """
    Static analysis only (no AI)
    """
    try:
        issues = analyzer.analyze(request.code, request.language)
        return {
            "issues": issues,
            "count": len(issues),
            "quality_score": 100 - min(50, len(issues) * 5)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detect-language")
async def detect_language(code: str):
    """
    Detect programming language from code
    """
    try:
        language = analyzer.detect_language(code)
        return {
            "language": language,
            "supported": language in analyzer.get_supported_languages()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/security-patterns")
async def get_security_patterns():
    """Get common security patterns"""
    return {
        "patterns": [
            {
                "name": "SQL Injection",
                "severity": "critical",
                "description": "Dynamic SQL queries with user input",
                "remediation": "Use parameterized queries"
            },
            {
                "name": "Hardcoded Credentials",
                "severity": "high",
                "description": "Passwords, keys, or tokens in code",
                "remediation": "Use environment variables"
            },
            {
                "name": "Cross-Site Scripting (XSS)",
                "severity": "high",
                "description": "Unsanitized user input in HTML",
                "remediation": "Use proper escaping/sanitization"
            },
            {
                "name": "eval() Usage",
                "severity": "critical",
                "description": "Using eval() with user input",
                "remediation": "Use safe alternatives"
            },
            {
                "name": "Insecure Deserialization",
                "severity": "high",
                "description": "Deserializing untrusted data",
                "remediation": "Validate and sanitize input"
            }
        ]
    }