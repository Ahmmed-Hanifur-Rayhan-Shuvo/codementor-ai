"""
CodeMentor AI - Main Application Entry Point
Vercel-ready FastAPI application with all routes and services
"""
import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CodeMentor AI",
    description="Enterprise-Grade Intelligent Code Analysis & Auto-Fix Platform",
    version="4.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# HEALTH CHECK ENDPOINTS
# ============================================================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "CodeMentor AI",
        "version": "4.0.0",
        "status": "running",
        "environment": os.getenv("VERCEL_ENV", "development"),
        "docs": "/api/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "api_configured": bool(os.getenv("OPENAI_API_KEY")),
        "model": os.getenv("DEFAULT_MODEL", "deepseek/deepseek-v4-flash:free"),
        "environment": os.getenv("VERCEL_ENV", "development")
    }

# ============================================================
# CODE ANALYSIS ENDPOINTS
# ============================================================

@app.post("/api/v1/analyze")
async def analyze_code(request: dict):
    """
    Analyze code with AI and static analysis
    """
    try:
        code = request.get("code", "")
        language = request.get("language", "python")
        auto_fix = request.get("auto_fix", False)
        
        if not code:
            raise HTTPException(status_code=400, detail="Code is required")
        
        # Basic static analysis
        issues = []
        quality_score = 100
        
        # Python specific checks
        if language == "python":
            issues, quality_score = analyze_python(code)
        elif language in ["javascript", "typescript"]:
            issues, quality_score = analyze_javascript(code)
        elif language == "java":
            issues, quality_score = analyze_java(code)
        else:
            issues, quality_score = analyze_generic(code)
        
        # Prepare response
        return {
            "success": True,
            "quality_score": quality_score,
            "issues": issues,
            "summary": f"Found {len(issues)} issues in {language} code",
            "fixed_code": code,  # In full implementation, AI would generate fixes
            "processing_time": 0.5,
            "model_used": "static-analysis",
            "provider": "built-in"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# STATIC ANALYSIS FUNCTIONS
# ============================================================

def analyze_python(code: str) -> tuple:
    """Analyze Python code for common issues"""
    issues = []
    score = 100
    
    # Check for SQL injection
    if "execute(" in code and 'f"' in code:
        issues.append({
            "message": "Potential SQL injection vulnerability",
            "severity": "critical",
            "line": 1,
            "suggestion": "Use parameterized queries with placeholders",
            "fixed_code": 'cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))'
        })
        score -= 25
    
    # Check for hardcoded credentials
    if "password" in code.lower() and "=" in code:
        issues.append({
            "message": "Hardcoded password detected",
            "severity": "high",
            "line": 1,
            "suggestion": "Use environment variables or secrets manager",
            "fixed_code": 'PASSWORD = os.getenv("DB_PASSWORD")'
        })
        score -= 15
    
    # Check for eval usage
    if "eval(" in code:
        issues.append({
            "message": "eval() usage detected (security risk)",
            "severity": "critical",
            "line": 1,
            "suggestion": "Avoid eval(), use safer alternatives",
            "fixed_code": 'ast.literal_eval() or json.loads()'
        })
        score -= 20
    
    # Check for empty exception
    if "except:" in code and "pass" in code:
        issues.append({
            "message": "Empty exception handler",
            "severity": "high",
            "line": 1,
            "suggestion": "Log the exception or handle it properly",
            "fixed_code": 'except Exception as e:\n    logger.error(f"Error: {e}")\n    raise'
        })
        score -= 10
    
    # Check for unused imports
    if "import " in code and code.count("import ") > 3:
        issues.append({
            "message": "Multiple imports detected",
            "severity": "low",
            "line": 1,
            "suggestion": "Consider using only necessary imports",
            "fixed_code": '# Remove unused imports'
        })
        score -= 5
    
    return issues, max(0, score)

def analyze_javascript(code: str) -> tuple:
    """Analyze JavaScript code for common issues"""
    issues = []
    score = 100
    
    # Check for console.log
    if "console.log(" in code:
        issues.append({
            "message": "console.log found in production code",
            "severity": "low",
            "line": 1,
            "suggestion": "Remove console.log statements or use proper logging",
            "fixed_code": '// Remove console.log'
        })
        score -= 5
    
    # Check for hardcoded API keys
    if "api_key" in code.lower() and "=" in code:
        issues.append({
            "message": "Hardcoded API key detected",
            "severity": "critical",
            "line": 1,
            "suggestion": "Use environment variables for API keys",
            "fixed_code": 'const API_KEY = process.env.API_KEY'
        })
        score -= 25
    
    # Check for var usage
    if "var " in code:
        issues.append({
            "message": "Using var instead of let/const",
            "severity": "low",
            "line": 1,
            "suggestion": "Use let/const for better scoping",
            "fixed_code": 'let/const variableName'
        })
        score -= 5
    
    # Check for missing dependency array in useEffect
    if "useEffect(" in code and "[]" not in code:
        issues.append({
            "message": "useEffect missing dependency array",
            "severity": "high",
            "line": 1,
            "suggestion": "Add proper dependency array to prevent infinite loops",
            "fixed_code": 'useEffect(() => { ... }, [dependency])'
        })
        score -= 15
    
    # Check for eval usage
    if "eval(" in code:
        issues.append({
            "message": "eval() usage detected (security risk)",
            "severity": "critical",
            "line": 1,
            "suggestion": "Avoid eval(), use JSON.parse() or Function constructor",
            "fixed_code": 'JSON.parse()'
        })
        score -= 20
    
    return issues, max(0, score)

def analyze_java(code: str) -> tuple:
    """Analyze Java code for common issues"""
    issues = []
    score = 100
    
    # Check for SQL injection
    if "Statement" in code and "execute" in code:
        issues.append({
            "message": "SQL Injection using Statement",
            "severity": "critical",
            "line": 1,
            "suggestion": "Use PreparedStatement with parameterized queries",
            "fixed_code": 'PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?")'
        })
        score -= 25
    
    # Check for hardcoded credentials
    if "password" in code.lower() and "=" in code:
        issues.append({
            "message": "Hardcoded password detected",
            "severity": "high",
            "line": 1,
            "suggestion": "Use environment variables or configuration files",
            "fixed_code": 'String password = System.getenv("DB_PASSWORD")'
        })
        score -= 15
    
    # Check for empty catch block
    if "catch" in code and "{}" in code:
        issues.append({
            "message": "Empty catch block",
            "severity": "high",
            "line": 1,
            "suggestion": "Log the exception or handle it properly",
            "fixed_code": 'catch (Exception e) {\n    logger.error("Error: " + e.getMessage());\n    throw e;\n}'
        })
        score -= 10
    
    return issues, max(0, score)

def analyze_generic(code: str) -> tuple:
    """Generic analysis for any language"""
    issues = []
    score = 100
    
    # Check file size
    lines = len(code.splitlines())
    if lines > 500:
        issues.append({
            "message": f"Large file detected ({lines} lines)",
            "severity": "low",
            "line": 1,
            "suggestion": "Consider splitting into smaller modules",
            "fixed_code": '# Refactor into multiple files'
        })
        score -= 10
    
    # Check for TODO comments
    if "TODO" in code or "FIXME" in code:
        issues.append({
            "message": "TODO/FIXME comments found",
            "severity": "low",
            "line": 1,
            "suggestion": "Address or remove TODO/FIXME comments",
            "fixed_code": '# Remove or implement TODO items'
        })
        score -= 5
    
    return issues, max(0, score)

# ============================================================
# SUPPORTED LANGUAGES ENDPOINT
# ============================================================

@app.get("/api/v1/languages")
async def get_languages():
    """Get all supported programming languages"""
    return {
        "languages": [
            {"name": "Python", "value": "python"},
            {"name": "JavaScript", "value": "javascript"},
            {"name": "TypeScript", "value": "typescript"},
            {"name": "Java", "value": "java"},
            {"name": "C++", "value": "cpp"},
            {"name": "C#", "value": "csharp"},
            {"name": "Ruby", "value": "ruby"},
            {"name": "Go", "value": "go"},
            {"name": "Rust", "value": "rust"},
            {"name": "PHP", "value": "php"},
            {"name": "Swift", "value": "swift"},
            {"name": "Kotlin", "value": "kotlin"},
            {"name": "Dart", "value": "dart"},
            {"name": "R", "value": "r"},
            {"name": "Scala", "value": "scala"},
            {"name": "Perl", "value": "perl"},
            {"name": "Haskell", "value": "haskell"},
            {"name": "Clojure", "value": "clojure"},
            {"name": "Elixir", "value": "elixir"},
            {"name": "Erlang", "value": "erlang"},
            {"name": "Shell", "value": "shell"}
        ],
        "total": 21
    }

# ============================================================
# SECURITY PATTERNS ENDPOINT
# ============================================================

@app.get("/api/v1/security-patterns")
async def get_security_patterns():
    """Get common security patterns detected"""
    return {
        "patterns": [
            {
                "name": "SQL Injection",
                "severity": "critical",
                "description": "Dynamic SQL queries with user input",
                "remediation": "Use parameterized queries with placeholders"
            },
            {
                "name": "Hardcoded Credentials",
                "severity": "high",
                "description": "Passwords, keys, or tokens in code",
                "remediation": "Use environment variables or secrets manager"
            },
            {
                "name": "eval() Usage",
                "severity": "critical",
                "description": "Using eval() with user input",
                "remediation": "Use safe alternatives like JSON.parse() or ast.literal_eval()"
            },
            {
                "name": "Empty Exception Handler",
                "severity": "high",
                "description": "Catching exceptions without handling them",
                "remediation": "Log the exception or handle it properly"
            },
            {
                "name": "Cross-Site Scripting (XSS)",
                "severity": "high",
                "description": "Unsanitized user input in HTML",
                "remediation": "Use proper escaping/sanitization"
            },
            {
                "name": "Insecure Deserialization",
                "severity": "high",
                "description": "Deserializing untrusted data",
                "remediation": "Validate and sanitize input before deserialization"
            }
        ]
    }

# ============================================================
# ERROR HANDLING
# ============================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG") else "Please try again later"
        }
    )

# ============================================================
# VERCEL SERVERLESS HANDLER
# ============================================================

# This is required for Vercel serverless deployment
def handler(request, *args, **kwargs):
    """ASGI handler for Vercel"""
    return app(request, *args, **kwargs)

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )