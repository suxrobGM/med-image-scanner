import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv(verbose=True)

def getenv_required(name: str) -> str:
    """
    Get the value of an environment variable. Raise an exception if the variable is not set
    Args:
        name (str): Name of the environment variable
    Returns:
        str: Value of the environment variable
    Raises:
        ValueError: Environment variable is not set
    """
    value = os.getenv(name)
    
    if value is None:
        raise ValueError(f"The required environment variable '{name}' is not defined")
    
    return value
