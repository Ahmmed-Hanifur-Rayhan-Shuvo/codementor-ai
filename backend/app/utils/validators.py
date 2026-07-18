import re
from typing import Tuple

def validate_code(code: str) -> Tuple[bool, str]:
    if not code or not code.strip():
        return False, "Code is empty"
    
    if len(code) > 100000:
        return False, "Code is too large (max 100,000 characters)"
    
    return True, ""

def validate_language(language: str) -> bool:
    valid_languages = [
        'python', 'javascript', 'typescript', 'java', 'cpp', 'csharp',
        'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'dart',
        'r', 'scala', 'perl', 'haskell', 'clojure', 'elixir', 'erlang'
    ]
    return language in valid_languages

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> Tuple[bool, str]:
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, ""