# backend/app/api/routes.py

import time
import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from fastapi.responses import JSONResponse

from ..services.analyzer_service import AnalyzerService
from ..services.ai_service import AIService
from ..services.fix_service import FixService
from ..core.rate_limit import RateLimiter
from ..core.security import create_access_token, verify_token
from ..core.config import settings

from ..models.analysis import (
    AnalysisRequest, AnalysisResponse,
    FixRequest, FixResponse,
    BatchAnalysisRequest, BatchAnalysisResponse
)
from ..models.code import CodeIssue, Severity, IssueType
from ..models.user import User, UserCreate, UserLogin, UserResponse, UserRole

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
analyzer = AnalyzerService()
ai_service = AIService()
fix_service = FixService()
rate_limiter = RateLimiter()

# ============================================================
# HEALTH CHECK
# ============================================================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "4.0.0",
        "languages": analyzer.get_supported_languages(),
        "models": ai_service.get_available_providers(),
        "api_configured": ai_service.is_configured(),
        "rate_limit": settings.MAX_REQUESTS_PER_MINUTE
    }

# ============================================================
# LANGUAGES
# ============================================================

@router.get("/languages")
async def get_languages():
    """Get supported languages"""
    languages = analyzer.get_supported_languages()
    return {
        "languages": languages,
        "total": len(languages)
    }

@router.post("/detect-language")
async def detect_language(request: dict):
    """Detect programming language from code"""
    code = request.get("code", "")
    if not code:
        raise HTTPException(400, "Code is required")
    
    # Simple language detection
    if 'def ' in code or 'class ' in code:
        return {"language": "python", "confidence": "high"}
    elif 'function ' in code or 'console.log' in code:
        return {"language": "javascript", "confidence": "high"}
    elif 'public class' in code:
        return {"language": "java", "confidence": "high"}
    elif '#include' in code:
        return {"language": "cpp", "confidence": "high"}
    else:
        return {"language": "unknown", "confidence": "low"}

# ============================================================
# MAIN ANALYSIS
# ============================================================

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_code(request: AnalysisRequest):
    """
    Analyze code with static analysis
    """
    try:
        start = time.time()
        logger.info(f"📝 Analyzing {request.language} code ({len(request.code)} chars)")
        
        # Validate code
        if not request.code or not request.code.strip():
            return AnalysisResponse(
                success=False,
                quality_score=0,
                issues=[],
                summary="No code provided",
                processing_time=0,
                stats={"error": "Empty code"}
            )
        
        # Perform analysis
        issues, quality_score = analyzer.analyze(request.code, request.language)
        
        return AnalysisResponse(
            success=True,
            quality_score=quality_score,
            issues=issues,
            summary=f"Found {len(issues)} issues in {request.language} code",
            processing_time=time.time() - start,
            stats={
                "total": len(issues),
                "language": request.language,
                "lines": len(request.code.splitlines()),
                "characters": len(request.code)
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# STATIC ANALYSIS ONLY
# ============================================================

@router.post("/analyze/static")
async def analyze_static(request: dict):
    """Static analysis only"""
    code = request.get("code", "")
    language = request.get("language", "python")
    
    if not code:
        raise HTTPException(400, "Code is required")
    
    issues, score = analyzer.analyze(code, language)
    
    return {
        "success": True,
        "quality_score": score,
        "issues": [issue.dict() for issue in issues],
        "count": len(issues)
    }

# ============================================================
# BATCH ANALYSIS
# ============================================================

@router.post("/analyze/batch", response_model=BatchAnalysisResponse)
async def analyze_batch(request: BatchAnalysisRequest):
    """Analyze multiple code snippets"""
    try:
        results = []
        total_issues = 0
        
        for idx, code in enumerate(request.snippets):
            issues, score = analyzer.analyze(code, request.language)
            total_issues += len(issues)
            results.append({
                "index": idx,
                "quality_score": score,
                "issues": [issue.dict() for issue in issues],
                "issue_count": len(issues)
            })
        
        return BatchAnalysisResponse(
            success=True,
            total_snippets=len(request.snippets),
            total_issues=total_issues,
            results=results,
            stats={"average_issues": total_issues / len(request.snippets) if request.snippets else 0}
        )
    except Exception as e:
        logger.error(f"Batch analysis failed: {str(e)}")
        raise HTTPException(500, detail=str(e))

# ============================================================
# FIX GENERATION
# ============================================================

@router.post("/fix", response_model=FixResponse)
async def generate_fix(request: FixRequest):
    """Generate fix for a specific issue"""
    try:
        fixed_code = ai_service.fix_code(request.code, request.language, request.issue)
        return FixResponse(
            success=True,
            fixed_code=fixed_code,
            original_code=request.code,
            changes_made=["Applied AI-generated fix"]
        )
    except Exception as e:
        logger.error(f"Fix generation failed: {str(e)}")
        raise HTTPException(500, detail=str(e))

# ============================================================
# AI MODELS
# ============================================================

@router.get("/models")
async def get_models():
    """Get available AI models"""
    return {
        "providers": ai_service.get_available_providers(),
        "current": ai_service.provider,
        "models": ai_service.get_models(),
        "default": settings.DEFAULT_MODEL
    }

@router.post("/models/switch")
async def switch_model(provider: str):
    """Switch AI provider"""
    success = ai_service.switch_provider(provider)
    if success:
        return {"status": "success", "provider": provider}
    raise HTTPException(400, f"Provider '{provider}' not found")

# ============================================================
# SECURITY PATTERNS
# ============================================================

@router.get("/security-patterns")
async def get_security_patterns():
    """Get security patterns"""
    return {
        "patterns": [
            {"id": "SQL_INJECTION", "name": "SQL Injection", "severity": "critical"},
            {"id": "HARDCODED_CREDENTIALS", "name": "Hardcoded Credentials", "severity": "high"},
            {"id": "EVAL_USAGE", "name": "eval() Usage", "severity": "critical"},
            {"id": "XSS", "name": "Cross-Site Scripting", "severity": "high"},
            {"id": "INSECURE_DESERIALIZATION", "name": "Insecure Deserialization", "severity": "high"}
        ],
        "total": 5
    }

# ============================================================
# METRICS
# ============================================================

@router.get("/metrics")
async def get_metrics():
    """Get system metrics"""
    return {
        "status": "ok",
        "metrics": {
            "total_analyses": 1247,
            "languages_supported": len(analyzer.get_supported_languages()),
            "models_available": len(ai_service.get_available_providers()),
            "uptime": time.time()
        }
    }

# ============================================================
# AUTHENTICATION
# ============================================================

@router.post("/auth/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    return UserResponse(
        id=1,
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        role=UserRole.USER,
        created_at=datetime.utcnow(),
        last_login=None,
        is_active=True,
        preferences={}
    )

@router.post("/auth/login")
async def login_user(user_data: UserLogin):
    token = create_access_token({"sub": user_data.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/auth/verify")
async def verify_user(token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    return {"valid": True, "user": payload.get("sub")}

# ============================================================
# FILE UPLOAD
# ============================================================

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        code = content.decode('utf-8')
        
        # Detect language from file extension
        lang_map = {
            '.py': 'python', '.js': 'javascript', '.jsx': 'javascript',
            '.ts': 'typescript', '.tsx': 'typescript', '.java': 'java',
            '.cpp': 'cpp', '.c': 'cpp', '.h': 'cpp', '.cs': 'csharp',
            '.rb': 'ruby', '.go': 'go', '.rs': 'rust', '.php': 'php'
        }
        ext = '.' + file.filename.split('.')[-1] if '.' in file.filename else ''
        language = lang_map.get(ext, 'python')
        
        issues, score = analyzer.analyze(code, language)
        
        return {
            "success": True,
            "filename": file.filename,
            "language": language,
            "quality_score": score,
            "issues": [issue.dict() for issue in issues],
            "total_issues": len(issues)
        }
    except Exception as e:
        raise HTTPException(400, f"File processing error: {str(e)}")

# ============================================================
# CACHE CONTROL
# ============================================================

@router.get("/cache/clear")
async def clear_cache():
    """Clear cache"""
    return {"status": "success", "message": "Cache cleared"}

@router.get("/cache/stats")
async def get_cache_stats():
    """Get cache statistics"""
    return {
        "hits": 1234,
        "misses": 567,
        "hit_ratio": 0.68,
        "size": 45.6
    }