# backend/app/services/analyzer_service.py

import re
from typing import List, Tuple
from ..models.code import CodeIssue, Severity, IssueType

class AnalyzerService:
    """Complete Code Analyzer with Auto-Fix"""
    
    def analyze(self, code: str, language: str) -> Tuple[List[CodeIssue], int]:
        if not code or not code.strip():
            return [], 100
        
        issues = []
        lines = code.split('\n')
        
        # ============================================================
        # 1. SYNTAX ERRORS
        # ============================================================
        
        # Missing colon (Python)
        if language == "python":
            for i, line in enumerate(lines):
                stripped = line.strip()
                if not stripped or stripped.startswith('#'):
                    continue
                if stripped.startswith(('def ', 'class ', 'if ', 'elif ', 'else', 'for ', 'while ', 'try', 'except', 'finally')):
                    if ':' not in stripped:
                        issues.append(CodeIssue(
                            message=f"❌ Missing colon ':' in line {i+1}",
                            severity=Severity.CRITICAL,
                            suggestion="Add ':' at the end of the statement",
                            type=IssueType.BUG,
                            line=i+1,
                            fixed_code=line + ':'  # ফিক্স কোড
                        ))
                        break
        
        # Missing semicolon (JavaScript, C++, Java, C#)
        if language in ["javascript", "cpp", "java", "csharp"]:
            for i, line in enumerate(lines):
                stripped = line.strip()
                if not stripped or stripped.startswith(('//', '/*', '#')):
                    continue
                if stripped.endswith(('{', '}', ';')):
                    continue
                if stripped.startswith(('function', 'if', 'for', 'while', 'switch', 'try', 'return', 'let', 'const', 'var', 'int', 'void', 'char', 'float', 'double', 'class', 'struct')):
                    continue
                issues.append(CodeIssue(
                    message=f"⚠️ Missing semicolon ';' in line {i+1}",
                    severity=Severity.MEDIUM,
                    suggestion="Add ';' at the end of the statement",
                    type=IssueType.CODE_QUALITY,
                    line=i+1,
                    fixed_code=line + ';'  # ফিক্স কোড
                ))
                break
        
        # Missing closing parenthesis
        for i, line in enumerate(lines):
            if '(' in line and ')' not in line:
                if not line.strip().startswith('#'):
                    issues.append(CodeIssue(
                        message=f"❌ Missing closing parenthesis ')' in line {i+1}",
                        severity=Severity.CRITICAL,
                        suggestion="Add ')' after the parameters",
                        type=IssueType.BUG,
                        line=i+1,
                        fixed_code=line + ')'  # ফিক্স কোड
                    ))
                    break
        
        # ============================================================
        # 2. SECURITY VULNERABILITIES
        # ============================================================
        
        # SQL Injection
        if re.search(r'execute\s*\(\s*f[\'"]', code) or re.search(r'Statement\s+.*?execute', code):
            issues.append(CodeIssue(
                message="🔴 CRITICAL: SQL Injection vulnerability detected",
                severity=Severity.CRITICAL,
                suggestion="Use parameterized queries with placeholders",
                type=IssueType.SECURITY,
                line=1,
                fixed_code='cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))'  # ফিক্স কোড
            ))
        
        # Hardcoded credentials
        if re.search(r'(password|passwd|secret|api_key|token)\s*=\s*[\'"][^\'"]+[\'"]', code, re.IGNORECASE):
            issues.append(CodeIssue(
                message="🔑 SECURITY: Hardcoded credential detected",
                severity=Severity.HIGH,
                suggestion="Use environment variables",
                type=IssueType.SECURITY,
                line=1,
                fixed_code='PASSWORD = os.getenv("PASSWORD")'  # ফিক্স কোড
            ))
        
        # eval()
        if 'eval(' in code:
            issues.append(CodeIssue(
                message="🚫 CRITICAL: eval() usage detected (RCE risk)",
                severity=Severity.CRITICAL,
                suggestion="Use ast.literal_eval() or json.loads()",
                type=IssueType.SECURITY,
                line=1,
                fixed_code='ast.literal_eval(data)'  # ফিক্স কোড
            ))
        
        # ============================================================
        # 3. LOGIC ERRORS
        # ============================================================
        
        # Division by zero
        if re.search(r'/[\s]*0', code):
            issues.append(CodeIssue(
                message="⚠️ Division by zero detected",
                severity=Severity.HIGH,
                suggestion="Check for zero before division",
                type=IssueType.BUG,
                line=1,
                fixed_code='if denominator != 0:\n    result = numerator / denominator'  # ফিক্স কোড
            ))
        
        # Off-by-one
        if 'range(' in code and '+ 1)' in code:
            issues.append(CodeIssue(
                message="⚠️ Off-by-one error in range()",
                severity=Severity.CRITICAL,
                suggestion="Use range(len(list)) without +1",
                type=IssueType.BUG,
                line=1,
                fixed_code='for i in range(len(numbers)):'  # ফিক্স কোড
            ))
        
        # ============================================================
        # 4. CODE QUALITY
        # ============================================================
        
        # print()
        if 'print(' in code and language == "python":
            issues.append(CodeIssue(
                message="📝 print() in production code",
                severity=Severity.LOW,
                suggestion="Use logging module instead of print()",
                type=IssueType.CODE_QUALITY,
                line=1,
                fixed_code='logger.info("message")'  # ফিক্স কোড
            ))
        
        # console.log
        if 'console.log' in code and language in ["javascript", "typescript"]:
            issues.append(CodeIssue(
                message="📝 console.log in production code",
                severity=Severity.LOW,
                suggestion="Remove console.log or use proper logging",
                type=IssueType.CODE_QUALITY,
                line=1,
                fixed_code='// console.log removed'  # ফিক্স কোড
            ))
        
        # var usage
        if language in ["javascript", "typescript"] and 'var ' in code:
            issues.append(CodeIssue(
                message="📌 Using 'var' instead of 'let' or 'const'",
                severity=Severity.LOW,
                suggestion="Use 'let' for mutable, 'const' for immutable",
                type=IssueType.CODE_QUALITY,
                line=1,
                fixed_code=code.replace('var ', 'let ')  # ফিক্স কোড
            ))
        
        # ============================================================
        # 5. LANGUAGE SPECIFIC
        # ============================================================
        
        # strcpy (C++)
        if language == "cpp" and 'strcpy(' in code:
            issues.append(CodeIssue(
                message="🔴 CRITICAL: strcpy usage (buffer overflow risk)",
                severity=Severity.CRITICAL,
                suggestion="Use strcpy_s or std::string",
                type=IssueType.SECURITY,
                line=1,
                fixed_code='strcpy_s(dest, sizeof(dest), src);'  # ফিক্স কোড
            ))
        
        # using namespace std (C++)
        if language == "cpp" and 'using namespace std;' in code:
            issues.append(CodeIssue(
                message="📌 'using namespace std;' is bad practice",
                severity=Severity.LOW,
                suggestion="Use std:: prefix instead",
                type=IssueType.CODE_QUALITY,
                line=1,
                fixed_code='std::cout << "Hello" << std::endl;'  # ফিক্স কোড
            ))
        
        # Missing end (Ruby)
        if language == "ruby" and 'def ' in code and 'end' not in code:
            issues.append(CodeIssue(
                message="❌ Missing 'end' for method definition",
                severity=Severity.CRITICAL,
                suggestion="Add 'end' at the end of the method",
                type=IssueType.BUG,
                line=len(lines),
                fixed_code=code + '\nend'  # ফিক্স কোড
            ))
        
        # unwrap() (Rust)
        if language == "rust" and 'unwrap()' in code:
            issues.append(CodeIssue(
                message="⚠️ unwrap() usage (may panic)",
                severity=Severity.HIGH,
                suggestion="Use proper error handling with Result or Option",
                type=IssueType.BUG,
                line=1,
                fixed_code='match result {\n    Ok(value) => value,\n    Err(e) => panic!("Error: {}", e),\n}'  # ফিক্স কোড
            ))
        
        # Force unwrapping (Swift)
        if language == "swift" and '!' in code:
            issues.append(CodeIssue(
                message="⚠️ Force unwrapping (!) may crash",
                severity=Severity.MEDIUM,
                suggestion="Use optional binding (if let) or guard",
                type=IssueType.BUG,
                line=1,
                fixed_code='if let value = optionalValue {\n    print(value)\n} else {\n    print("Value is nil")\n}'  # ফিক্স কোড
            ))
        
        # !! operator (Kotlin)
        if language == "kotlin" and '!!' in code:
            issues.append(CodeIssue(
                message="⚠️ !! operator (may cause NullPointerException)",
                severity=Severity.MEDIUM,
                suggestion="Use safe call (?.) or Elvis operator (?:)",
                type=IssueType.BUG,
                line=1,
                fixed_code='val length = str?.length ?: 0'  # ফিক্স কোড
            ))
        
        # ============================================================
        # 6. GENERIC
        # ============================================================
        
        # TODO/FIXME
        if "TODO" in code or "FIXME" in code:
            issues.append(CodeIssue(
                message="📌 TODO/FIXME comments found",
                severity=Severity.LOW,
                suggestion="Address or remove TODO/FIXME comments",
                type=IssueType.CODE_QUALITY,
                line=1,
                fixed_code='# Addressed TODO'  # ফিক্স কোড
            ))
        
        # Empty catch block
        if re.search(r'catch\s*\([^)]*\)\s*\{\s*\}', code):
            issues.append(CodeIssue(
                message="⚠️ Empty catch block",
                severity=Severity.HIGH,
                suggestion="Log the exception or handle it properly",
                type=IssueType.BUG,
                line=1,
                fixed_code='catch (Exception e) {\n    logger.error("Error: " + e.getMessage());\n    throw e;\n}'  # ফিক্স কোড
            ))
        
        # ============================================================
        # SCORE CALCULATION
        # ============================================================
        
        score = self._calculate_score(issues)
        return issues, score
    
    def _calculate_score(self, issues: List[CodeIssue]) -> int:
        if not issues:
            return 100
        
        weights = {
            Severity.CRITICAL: 20,
            Severity.HIGH: 15,
            Severity.MEDIUM: 10,
            Severity.LOW: 5
        }
        
        deduction = sum(weights.get(i.severity, 5) for i in issues)
        return max(0, 100 - deduction)