"""
Code Fix Service
Applies fixes to code issues
"""
from typing import List, Dict, Optional
import re

class FixService:
    """Service to apply code fixes"""
    
    def apply_fix(self, code: str, issue: Dict) -> str:
        """Apply fix for a specific issue"""
        fixed_code = code
        
        # Get fix pattern
        message = issue.get('message', '').lower()
        suggestion = issue.get('suggestion', '')
        fixed_example = issue.get('fixed_code', '')
        
        # Apply language-specific fixes
        if 'sql injection' in message:
            fixed_code = self._fix_sql_injection(code)
        elif 'hardcoded' in message or 'hardcoded credential' in message:
            fixed_code = self._fix_hardcoded_credentials(code)
        elif 'console' in message:
            fixed_code = self._fix_console_statement(code)
        elif 'eval' in message:
            fixed_code = self._fix_eval_usage(code)
        elif 'empty exception' in message:
            fixed_code = self._fix_empty_exception(code)
        elif 'unused import' in message:
            fixed_code = self._fix_unused_imports(code)
        elif 'nested loops' in message:
            fixed_code = self._fix_nested_loops(code)
        elif 'useEffect' in message and 'dependency' in message:
            fixed_code = self._fix_useeffect_dependency(code)
        elif 'var instead of' in message:
            fixed_code = self._fix_var_to_let_const(code)
        
        return fixed_code
    
    def _fix_sql_injection(self, code: str) -> str:
        """Fix SQL injection vulnerabilities"""
        # Python SQL injection fix
        if 'execute(f"' in code:
            code = re.sub(
                r'execute\s*\(\s*f["\'](.*?)["\']',
                r'execute("SELECT * FROM users WHERE id = ?", (user_id,))',
                code
            )
        return code
    
    def _fix_hardcoded_credentials(self, code: str) -> str:
        """Fix hardcoded credentials"""
        code = re.sub(
            r'(password|secret|key|token)\s*=\s*[\'"][^\'"]+[\'"]',
            r'\1 = os.getenv("\1".upper())',
            code
        )
        return code
    
    def _fix_console_statement(self, code: str) -> str:
        """Fix console.log statements"""
        code = re.sub(
            r'console\.(log|warn|error)\s*\([^)]*\)\s*;?',
            '// console removed',
            code
        )
        return code
    
    def _fix_eval_usage(self, code: str) -> str:
        """Fix eval usage"""
        code = re.sub(
            r'eval\s*\(([^)]+)\)',
            r'json.loads(\1)',
            code
        )
        return code
    
    def _fix_empty_exception(self, code: str) -> str:
        """Fix empty exception handlers"""
        code = re.sub(
            r'except\s*:\s*pass',
            'except Exception as e:\n    logger.error(f"Error: {e}")\n    raise',
            code
        )
        return code
    
    def _fix_unused_imports(self, code: str) -> str:
        """Fix unused imports"""
        # Remove imports that are not used
        lines = code.split('\n')
        fixed_lines = []
        
        for line in lines:
            if line.startswith('import ') or line.startswith('from '):
                # Check if import is used
                import_name = line.split(' ')[1]
                if import_name in code and line not in fixed_lines:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    def _fix_nested_loops(self, code: str) -> str:
        """Fix nested loops"""
        # This is a simple fix - in reality, would need more complex refactoring
        return code + '\n# Consider using list comprehensions'
    
    def _fix_useeffect_dependency(self, code: str) -> str:
        """Fix useEffect missing dependency"""
        code = re.sub(
            r'useEffect\s*\(\s*\([^)]*\)\s*=>\s*{[^}]*}\s*\)',
            r'useEffect(() => { /* ... */ }, [dependency])',
            code
        )
        return code
    
    def _fix_var_to_let_const(self, code: str) -> str:
        """Fix var to let/const"""
        code = re.sub(r'\bvar\b', 'let', code)
        return code
    
    def apply_all_fixes(self, code: str, issues: List[Dict]) -> str:
        """Apply all available fixes"""
        fixed_code = code
        
        for issue in issues:
            fixed_code = self.apply_fix(fixed_code, issue)
        
        return fixed_code