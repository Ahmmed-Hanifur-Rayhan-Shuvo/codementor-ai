"""
Utility helper functions
"""
import re
from typing import Dict, List

def clean_code(code: str) -> str:
    """Clean and normalize code"""
    # Remove excessive whitespace
    code = re.sub(r'\n\s*\n', '\n\n', code)
    # Remove trailing whitespace
    code = '\n'.join(line.rstrip() for line in code.splitlines())
    return code.strip()

def count_lines(code: str) -> int:
    """Count non-empty lines"""
    return len([line for line in code.splitlines() if line.strip()])

def extract_function_name(code: str) -> str:
    """Extract function name from code"""
    match = re.search(r'def\s+(\w+)\s*\(', code)
    if match:
        return match.group(1)
    match = re.search(r'function\s+(\w+)\s*\(', code)
    if match:
        return match.group(1)
    return 'unknown'

def detect_language_from_code(code: str) -> str:
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

def get_code_stats(code: str) -> Dict:
    """Get statistics about code"""
    lines = code.splitlines()
    non_empty_lines = [l for l in lines if l.strip()]
    
    return {
        'total_lines': len(lines),
        'non_empty_lines': len(non_empty_lines),
        'characters': len(code),
        'functions': len(re.findall(r'def\s+\w+\s*\(', code)) + len(re.findall(r'function\s+\w+\s*\(', code)),
        'classes': len(re.findall(r'class\s+\w+', code)),
        'imports': len(re.findall(r'import\s+', code))
    }

def format_issue_message(message: str, severity: str) -> str:
    """Format issue message with emoji"""
    emojis = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🔵'
    }
    return f"{emojis.get(severity, '⚪')} {message}"

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def truncate_code(code: str, max_length: int = 1000) -> str:
    """Truncate code to max length"""
    if len(code) <= max_length:
        return code
    return code[:max_length] + "\n... (truncated)"

def split_code_into_chunks(code: str, chunk_size: int = 500) -> List[str]:
    """Split code into chunks for processing"""
    lines = code.splitlines()
    chunks = []
    current_chunk = []
    
    for line in lines:
        current_chunk.append(line)
        if len('\n'.join(current_chunk)) > chunk_size:
            chunks.append('\n'.join(current_chunk[:-1]))
            current_chunk = [current_chunk[-1]]
    
    if current_chunk:
        chunks.append('\n'.join(current_chunk))
    
    return chunks