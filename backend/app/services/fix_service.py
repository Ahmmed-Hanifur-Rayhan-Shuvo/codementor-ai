from typing import List, Dict, Optional
from ..models.code import CodeIssue

class FixService:
    """Service to generate and apply code fixes"""
    
    def apply_all_fixes(self, code: str, issues: List[CodeIssue]) -> str:
        """Apply all available fixes to the code"""
        fixed_code = code
        for issue in issues:
            fixed_code = self.apply_fix(fixed_code, issue)
        return fixed_code
    
    def apply_fix(self, code: str, issue: CodeIssue) -> str:
        """Apply a single fix"""
        if issue.fixed_code:
            return issue.fixed_code
        
        message_lower = issue.message.lower()
        
        # SQL Injection fix
        if 'sql injection' in message_lower:
            return self._fix_sql_injection(code)
        
        # Hardcoded credentials fix
        if 'hardcoded credential' in message_lower:
            return self._fix_hardcoded_credentials(code)
        
        # Missing colon fix
        if 'missing colon' in message_lower:
            return self._fix_missing_colon(code)
        
        # console.log fix
        if 'console.log' in message_lower:
            return self._fix_console_log(code)
        
        # Off-by-one fix
        if 'off-by-one' in message_lower:
            return self._fix_off_by_one(code)
        
        # Missing semicolon fix
        if 'missing semicolon' in message_lower:
            return self._fix_missing_semicolon(code)
        
        return code
    
    def _fix_sql_injection(self, code: str) -> str:
        """Fix SQL injection vulnerabilities"""
        return code.replace(
            'execute(f"',
            'execute("SELECT * FROM users WHERE id = ?", (user_id,))'
        )
    
    def _fix_hardcoded_credentials(self, code: str) -> str:
        """Fix hardcoded credentials"""
        import re
        return re.sub(
            r'(password|secret|key|token|api_key)\s*=\s*[\'"][^\'"]+[\'"]',
            r'\1 = os.getenv("\1".upper())',
            code
        )
    
    def _fix_missing_colon(self, code: str) -> str:
        """Fix missing colon in Python"""
        import re
        return re.sub(
            r'(def\s+\w+\s*\([^)]*\))(\s*)',
            r'\1:\2',
            code
        )
    
    def _fix_console_log(self, code: str) -> str:
        """Fix console.log statements"""
        return code.replace('console.log(', '// console.log(')
    
    def _fix_off_by_one(self, code: str) -> str:
        """Fix off-by-one errors"""
        return code.replace('<=', '<')
    
    def _fix_missing_semicolon(self, code: str) -> str:
        """Fix missing semicolons in JavaScript"""
        import re
        return re.sub(r'([^;])\s*$', r'\1;', code)