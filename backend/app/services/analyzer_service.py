"""
Static Code Analyzer Service
Supports 20+ programming languages
"""
import re
from typing import List, Dict, Optional
from ..models.code import CodeIssue, Severity, IssueType

class AnalyzerService:
    """Static code analyzer with pattern matching"""
    
    # Supported languages
    LANGUAGES = {
        'python': {'extensions': ['py'], 'name': 'Python'},
        'javascript': {'extensions': ['js', 'jsx'], 'name': 'JavaScript'},
        'typescript': {'extensions': ['ts', 'tsx'], 'name': 'TypeScript'},
        'java': {'extensions': ['java'], 'name': 'Java'},
        'csharp': {'extensions': ['cs'], 'name': 'C#'},
        'cpp': {'extensions': ['cpp', 'cxx', 'h', 'hpp'], 'name': 'C++'},
        'ruby': {'extensions': ['rb'], 'name': 'Ruby'},
        'go': {'extensions': ['go'], 'name': 'Go'},
        'rust': {'extensions': ['rs'], 'name': 'Rust'},
        'php': {'extensions': ['php'], 'name': 'PHP'},
        'swift': {'extensions': ['swift'], 'name': 'Swift'},
        'kotlin': {'extensions': ['kt', 'kts'], 'name': 'Kotlin'},
        'dart': {'extensions': ['dart'], 'name': 'Dart'},
        'r': {'extensions': ['r'], 'name': 'R'},
        'scala': {'extensions': ['scala'], 'name': 'Scala'},
        'perl': {'extensions': ['pl', 'pm'], 'name': 'Perl'},
        'haskell': {'extensions': ['hs'], 'name': 'Haskell'},
        'clojure': {'extensions': ['clj'], 'name': 'Clojure'},
        'elixir': {'extensions': ['ex', 'exs'], 'name': 'Elixir'},
        'erlang': {'extensions': ['erl'], 'name': 'Erlang'},
        'shell': {'extensions': ['sh', 'bash'], 'name': 'Shell Script'}
    }
    
    def analyze(self, code: str, language: str) -> List[CodeIssue]:
        """Analyze code for issues"""
        issues = []
        
        if language == "python":
            issues = self._analyze_python(code)
        elif language in ["javascript", "typescript"]:
            issues = self._analyze_javascript(code)
        elif language == "java":
            issues = self._analyze_java(code)
        elif language == "cpp":
            issues = self._analyze_cpp(code)
        elif language == "csharp":
            issues = self._analyze_csharp(code)
        elif language == "ruby":
            issues = self._analyze_ruby(code)
        elif language == "go":
            issues = self._analyze_go(code)
        elif language == "rust":
            issues = self._analyze_rust(code)
        elif language == "php":
            issues = self._analyze_php(code)
        else:
            issues = self._analyze_generic(code)
        
        return issues
    
    def _analyze_python(self, code: str) -> List[CodeIssue]:
        """Analyze Python code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'execute\s*\(\s*f[\'"]',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection vulnerability detected',
                'suggestion': 'Use parameterized queries with ? placeholders'
            },
            {
                'pattern': r'(password|secret|key|token)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables or secrets manager'
            },
            {
                'pattern': r'except\s*:\s*pass',
                'severity': Severity.HIGH,
                'type': IssueType.BUG,
                'message': 'Empty exception handler (swallows errors)',
                'suggestion': 'Log the exception or handle it properly'
            },
            {
                'pattern': r'eval\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'eval() usage detected (security risk)',
                'suggestion': 'Avoid eval(), use safer alternatives like ast.literal_eval()'
            },
            {
                'pattern': r'import\s+\w+\s+as\s+\w+',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'Potentially unused import',
                'suggestion': 'Remove unused imports or use them'
            },
            {
                'pattern': r'def\s+\w+\s*\(\s*\)\s*:\s*pass',
                'severity': Severity.MEDIUM,
                'type': IssueType.CODE_QUALITY,
                'message': 'Empty function definition found',
                'suggestion': 'Implement the function or remove it'
            },
            {
                'pattern': r'print\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'print() found in code',
                'suggestion': 'Use logging module instead of print for production'
            },
            {
                'pattern': r'for\s+.*?:\s*.*?for\s+',
                'severity': Severity.MEDIUM,
                'type': IssueType.PERFORMANCE,
                'message': 'Nested loops detected (O(n²))',
                'suggestion': 'Consider using list comprehensions or optimizing algorithm'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_javascript(self, code: str) -> List[CodeIssue]:
        """Analyze JavaScript/TypeScript code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'useEffect\s*\(\s*\([^)]*\)\s*=>\s*{[^}]*}\s*\)(?!\s*,\s*\[)',
                'severity': Severity.HIGH,
                'type': IssueType.BUG,
                'message': 'useEffect missing dependency array',
                'suggestion': 'Add proper dependency array to prevent infinite loops'
            },
            {
                'pattern': r'console\.(log|warn|error)\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'console statement found in production code',
                'suggestion': 'Remove console statements or use proper logging'
            },
            {
                'pattern': r'(api_key|apikey|secret)\s*[:=]\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded API key detected',
                'suggestion': 'Use environment variables for API keys'
            },
            {
                'pattern': r'var\s+\w+',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'Using var instead of let/const',
                'suggestion': 'Use let/const for better scoping'
            },
            {
                'pattern': r'==\s*(?!==)',
                'severity': Severity.MEDIUM,
                'type': IssueType.BEST_PRACTICE,
                'message': 'Using loose equality (==) instead of strict equality (===)',
                'suggestion': 'Use === for strict type checking'
            },
            {
                'pattern': r'eval\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'eval() usage detected (security risk)',
                'suggestion': 'Avoid eval(), use JSON.parse() or Function constructor'
            },
            {
                'pattern': r'document\.write\s*\(',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'document.write() usage (XSS risk)',
                'suggestion': 'Use DOM manipulation methods like createElement or innerHTML safely'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_java(self, code: str) -> List[CodeIssue]:
        """Analyze Java code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'Statement\s+.*?execute',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection using Statement',
                'suggestion': 'Use PreparedStatement with parameterized queries'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables or configuration files'
            },
            {
                'pattern': r'catch\s*\(\s*\w+\s+\w+\s*\)\s*\{\s*\}',
                'severity': Severity.HIGH,
                'type': IssueType.BUG,
                'message': 'Empty catch block',
                'suggestion': 'Log the exception or handle it properly'
            },
            {
                'pattern': r'System\.out\.println\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'System.out.println() found in code',
                'suggestion': 'Use logging framework (Log4j, SLF4J) instead'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_cpp(self, code: str) -> List[CodeIssue]:
        """Analyze C++ code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'strcpy\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'strcpy usage (buffer overflow risk)',
                'suggestion': 'Use strcpy_s or std::string'
            },
            {
                'pattern': r'printf\s*\(',
                'severity': Severity.MEDIUM,
                'type': IssueType.SECURITY,
                'message': 'printf usage (format string vulnerability)',
                'suggestion': 'Use cout or safer alternatives'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables'
            },
            {
                'pattern': r'delete\s+',
                'severity': Severity.MEDIUM,
                'type': IssueType.PERFORMANCE,
                'message': 'Manual memory management (risk of memory leaks)',
                'suggestion': 'Use smart pointers (unique_ptr, shared_ptr)'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_csharp(self, code: str) -> List[CodeIssue]:
        """Analyze C# code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'SqlCommand\s+.*?\.Execute',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection risk',
                'suggestion': 'Use parameterized queries with SqlParameter'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables or configuration'
            },
            {
                'pattern': r'Console\.WriteLine\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'Console.WriteLine() found in code',
                'suggestion': 'Use logging framework (NLog, Serilog)'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_ruby(self, code: str) -> List[CodeIssue]:
        """Analyze Ruby code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'execute\s*\(.*?\)',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection risk',
                'suggestion': 'Use parameterized queries with ActiveRecord'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables'
            },
            {
                'pattern': r'eval\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'eval() usage detected',
                'suggestion': 'Avoid eval() in Ruby'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_go(self, code: str) -> List[CodeIssue]:
        """Analyze Go code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'sql\.Query\s*\([^,]*\+',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection risk',
                'suggestion': 'Use parameterized queries with $1, $2 placeholders'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables with os.Getenv()'
            },
            {
                'pattern': r'fmt\.Println\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'fmt.Println() found in code',
                'suggestion': 'Use log package for logging'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_rust(self, code: str) -> List[CodeIssue]:
        """Analyze Rust code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'unwrap\s*\(\s*\)',
                'severity': Severity.HIGH,
                'type': IssueType.BUG,
                'message': 'unwrap() usage (may panic)',
                'suggestion': 'Use proper error handling with Result or Option'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables with std::env'
            },
            {
                'pattern': r'println!\s*\(',
                'severity': Severity.LOW,
                'type': IssueType.CODE_QUALITY,
                'message': 'println!() found in code',
                'suggestion': 'Use log crate for logging'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_php(self, code: str) -> List[CodeIssue]:
        """Analyze PHP code"""
        issues = []
        
        patterns = [
            {
                'pattern': r'mysql_query\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'SQL Injection risk (deprecated mysql_query)',
                'suggestion': 'Use PDO or MySQLi with prepared statements'
            },
            {
                'pattern': r'echo\s+.*?\$_',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'XSS vulnerability (direct output of user input)',
                'suggestion': 'Use htmlspecialchars() or use templating engine'
            },
            {
                'pattern': r'(password|secret)\s*=\s*[\'"][^\'"]+[\'"]',
                'severity': Severity.HIGH,
                'type': IssueType.SECURITY,
                'message': 'Hardcoded credential detected',
                'suggestion': 'Use environment variables with getenv()'
            },
            {
                'pattern': r'eval\s*\(',
                'severity': Severity.CRITICAL,
                'type': IssueType.SECURITY,
                'message': 'eval() usage detected (security risk)',
                'suggestion': 'Avoid eval() in PHP'
            }
        ]
        
        for pattern in patterns:
            if re.search(pattern['pattern'], code, re.DOTALL):
                issues.append(CodeIssue(
                    message=pattern['message'],
                    severity=pattern['severity'],
                    type=pattern['type'],
                    suggestion=pattern['suggestion'],
                    line=1
                ))
        
        return issues
    
    def _analyze_generic(self, code: str) -> List[CodeIssue]:
        """Generic analysis for unsupported languages"""
        issues = []
        
        # Check file size
        lines = code.splitlines()
        if len(lines) > 500:
            issues.append(CodeIssue(
                message="Large file detected (>500 lines)",
                severity=Severity.LOW,
                type=IssueType.MAINTAINABILITY,
                suggestion="Consider splitting into smaller modules for better maintainability"
            ))
        
        # Check for TODOs
        if "TODO" in code or "FIXME" in code:
            issues.append(CodeIssue(
                message="TODO/FIXME comments found",
                severity=Severity.LOW,
                type=IssueType.CODE_QUALITY,
                suggestion="Address or remove TODO/FIXME comments"
            ))
        
        # Check for hardcoded values
        if re.search(r'(password|secret|key|token)\s*=\s*[\'"][^\'"]+[\'"]', code, re.IGNORECASE):
            issues.append(CodeIssue(
                message="Potential hardcoded credential detected",
                severity=Severity.HIGH,
                type=IssueType.SECURITY,
                suggestion="Use environment variables for sensitive data"
            ))
        
        return issues
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages"""
        return list(self.LANGUAGES.keys())
    
    def get_language_info(self, language: str) -> Optional[Dict]:
        """Get information about a language"""
        return self.LANGUAGES.get(language)
    
    def detect_language(self, code: str) -> str:
        """Detect programming language from code"""
        code_lower = code.lower()
        
        if 'def ' in code and 'import ' in code and ':' in code:
            return 'python'
        elif 'function' in code or '=>' in code or 'const ' in code:
            return 'javascript'
        elif 'interface' in code and 'type ' in code:
            return 'typescript'
        elif 'public class' in code and 'void ' in code:
            return 'java'
        elif 'using System' in code:
            return 'csharp'
        elif '#include' in code and 'std::' in code:
            return 'cpp'
        elif 'def ' in code and 'end' in code:
            return 'ruby'
        elif 'package main' in code and 'func main' in code:
            return 'go'
        elif 'fn main' in code and 'println!' in code:
            return 'rust'
        elif '<?php' in code:
            return 'php'
        elif 'import Swift' in code:
            return 'swift'
        elif 'fun ' in code and 'class ' in code:
            return 'kotlin'
        else:
            return 'unknown'