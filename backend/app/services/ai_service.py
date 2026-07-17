"""
AI Service for Code Analysis
Supports multiple AI providers: OpenAI, DeepSeek, Claude, Gemini
"""
import json
import re
import time
from typing import Dict, List, Optional
from openai import OpenAI
from ..core.config import settings

class AIService:
    """AI service with multi-provider support"""
    
    def __init__(self, provider: str = "deepseek"):
        self.provider = provider
        self.client = None
        self.model = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize client for current provider"""
        provider_config = settings.AI_PROVIDERS.get(self.provider, {})
        api_key = provider_config.get("api_key", "")
        base_url = provider_config.get("base_url", "https://api.openai.com/v1")
        
        if api_key:
            self.client = OpenAI(
                api_key=api_key,
                base_url=base_url
            )
            self.model = provider_config.get("models", [""])[0]
        else:
            self.client = None
            self.model = None
    
    def switch_provider(self, provider: str):
        """Switch to different AI provider"""
        if provider in settings.AI_PROVIDERS:
            self.provider = provider
            self._initialize_client()
            return True
        return False
    
    def get_available_providers(self) -> List[str]:
        """Get list of available providers"""
        return list(settings.AI_PROVIDERS.keys())
    
    def analyze_code(self, code: str, language: str, auto_fix: bool = False) -> Dict:
        """
        Analyze code using AI
        Returns structured analysis results
        """
        if not self.client:
            return self._error_response("AI client not initialized")
        
        try:
            start_time = time.time()
            
            prompt = self._build_analysis_prompt(code, language, auto_fix)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a senior code reviewer and security expert. Return valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            result = self._parse_response(response.choices[0].message.content)
            result['processing_time'] = time.time() - start_time
            result['model_used'] = self.model
            result['provider'] = self.provider
            
            return result
            
        except Exception as e:
            return self._error_response(str(e))
    
    def _build_analysis_prompt(self, code: str, language: str, auto_fix: bool) -> str:
        """Build the analysis prompt"""
        return f"""You are a senior code reviewer. Analyze this {language} code.

CODE:
ANALYZE FOR:
1. Security vulnerabilities (SQL injection, XSS, hardcoded secrets)
2. Performance issues (inefficient algorithms, memory leaks)
3. Code quality issues (duplication, complexity, naming)
4. Potential bugs (edge cases, null pointers, race conditions)
5. Maintainability issues (coupling, cohesion, documentation)
6. Best practices violations

FOR EACH ISSUE:
- Provide severity: critical/high/medium/low
- Suggest specific line number
- Give actionable fix suggestion
- {'Provide fixed code snippet' if auto_fix else ''}

RETURN ONLY JSON:
{{
    "quality_score": 75,
    "issues": [
        {{
            "message": "Description of issue",
            "severity": "critical/high/medium/low",
            "line": 10,
            "suggestion": "How to fix it",
            {"fixed_code": "Fixed code" if auto_fix else ""}
        }}
    ],
    "summary": "Overall assessment"
}}"""
    
    def _parse_response(self, text: str) -> Dict:
        """Parse and clean AI response"""
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*$', '', text)
        text = re.sub(r'```', '', text)
        text = text.strip()
        
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group()
        
        try:
            result = json.loads(text)
            result.setdefault('quality_score', 70)
            result.setdefault('issues', [])
            result.setdefault('summary', 'Code analyzed successfully')
            return result
        except:
            return self._error_response("Invalid JSON response")
    
    def _error_response(self, error: str) -> Dict:
        """Return error response"""
        return {
            "quality_score": 50,
            "issues": [
                {
                    "message": f"Analysis error: {error}",
                    "severity": "low",
                    "line": 0,
                    "suggestion": "Please try again or check your connection"
                }
            ],
            "summary": "AI analysis failed",
            "error": error
        }
    
    def fix_code(self, code: str, language: str, issue: Dict) -> str:
        """Generate fix for a specific issue"""
        if not self.client:
            return code
        
        try:
            prompt = f"""Fix this {language} code.

ISSUE: {issue.get('message', 'Fix all issues')}
SUGGESTION: {issue.get('suggestion', 'Apply best practices')}

CODE:
Return ONLY the fixed code, no explanation."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Return only the fixed code."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Fix generation error: {e}")
            return code