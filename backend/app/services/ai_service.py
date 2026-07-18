# backend/app/services/ai_service.py - সম্পূর্ণ ফাইল

import json
import re
import time
from typing import Dict, List, Optional
from openai import OpenAI
from ..core.config import settings

class AIService:
    def __init__(self, provider: str = "deepseek"):
        self.provider = provider
        self.client = None
        self.model = None
        self._initialize_client()
    
    def _initialize_client(self):
        try:
            provider_config = settings.AI_PROVIDERS.get(self.provider, {})
            api_key = provider_config.get("api_key", "")
            base_url = settings.OPENAI_BASE_URL if self.provider == "deepseek" else None
            
            if api_key:
                self.client = OpenAI(
                    api_key=api_key,
                    base_url=base_url or "https://api.openai.com/v1"
                )
                self.model = provider_config.get("models", [""])[0]
            else:
                self.client = None
                self.model = None
        except Exception as e:
            print(f"AI Client initialization error: {e}")
            self.client = None
            self.model = None
    
    def is_configured(self) -> bool:
        return self.client is not None
    
    def get_available_providers(self) -> List[str]:
        return [p for p, config in settings.AI_PROVIDERS.items() if config.get("api_key")]
    
    def get_models(self) -> Dict:
        return {p: config.get("models", []) for p, config in settings.AI_PROVIDERS.items()}
    
    def switch_provider(self, provider: str) -> bool:
        if provider in settings.AI_PROVIDERS:
            self.provider = provider
            self._initialize_client()
            return True
        return False
    
    def analyze_code(self, code: str, language: str) -> Dict:
        if not self.client:
            return {
                "quality_score": 50,
                "issues": [],
                "summary": "AI service not configured. Please add API key.",
                "error": "AI service not configured"
            }
        
        try:
            start = time.time()
            
            prompt = f"""Analyze this {language} code. Return JSON only.

Code:
Return this exact JSON structure:
{{
    "quality_score": 75,
    "issues": [
        {{
            "message": "Issue description",
            "severity": "critical/high/medium/low",
            "line": 10,
            "suggestion": "How to fix",
            "fixed_code": "Fixed code"
        }}
    ],
    "summary": "Overall assessment"
}}"""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a code reviewer. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            result_text = response.choices[0].message.content
            result_text = re.sub(r'```json\s*', '', result_text)
            result_text = re.sub(r'```\s*$', '', result_text)
            result_text = result_text.strip()
            
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group()
            
            result = json.loads(result_text)
            result.setdefault('quality_score', 70)
            result.setdefault('issues', [])
            result.setdefault('summary', 'Code analyzed successfully')
            result['processing_time'] = time.time() - start
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            return {
                "quality_score": 50,
                "issues": [],
                "summary": "AI response parsing failed",
                "error": str(e)
            }
        except Exception as e:
            print(f"AI Error: {e}")
            return {
                "quality_score": 50,
                "issues": [],
                "summary": f"AI analysis failed: {str(e)}",
                "error": str(e)
            }
    
    def fix_code(self, code: str, language: str, issue: Dict) -> str:
        if not self.client:
            return code + "\n\n// AI service not configured. Please add API key."
        
        try:
            prompt = f"""Fix this {language} code.

Issue: {issue.get('message', '')}
Suggestion: {issue.get('suggestion', '')}

Code:
{code}

Return only the fixed code, no explanation."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Fix Error: {e}")
            return code + f"\n\n// AI fix failed: {str(e)}"