from urllib.parse import urlparse
from uuid import UUID
from email_validator import EmailSyntaxError, EmailUndeliverableError, validate_email

def valid_uuid(val: str | UUID) -> bool:
    """Check if a string is a valid UUID"""
    try:
        if isinstance(val, UUID):
            return True
        
        UUID(val)
        return True
    except ValueError:
        return False
    
def valid_email(val: str) -> bool:
    """Check if a string is a valid email"""
    try:
        validate_email(val)
        return True
    except EmailSyntaxError:
        return False
    except EmailUndeliverableError:
        return True # The email is valid but undeliverable
    
def empty_str(val: str | None) -> bool:
    """Check if a string is empty"""
    return val is None or val == ""

def valid_url(val: str) -> bool:
    """Check if a string is a valid URL"""
    try:
        result = urlparse(val)
        return all([result.scheme, result.netloc])
    except:
        return False
    
def valid_org_name(name: str) -> bool:
    """
    Check if the given organization name is valid.
    Rules:
        - The organization name must be at least 4 characters
        - The organization name must contain only alphanumeric characters, no spaces, and may contain only underscores
        - The organization name must not start or end with an underscore
        - The organization name must not start with a digit
        - The organization name must not contain two or more consecutive underscores
    Args:
        name (str): Organization name
    Returns:
        bool: True if the organization name is valid, False otherwise
    """
    # Check the length
    if len(name) < 4:
        return False
    
    # Check the first character
    if name[0].isdigit():
        return False
    
    # Check the last character
    if name[-1] == "_":
        return False
    
    # Check the characters
    for i, char in enumerate(name):
        if not char.isalnum() and char != "_":
            return False
        
        # Check for consecutive underscores
        if i > 0 and char == "_" and name[i - 1] == "_":
            return False
        
    return True
