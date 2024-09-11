from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError

def validation_error_handler(request: Request, ex: ValidationError):
    """Handle Pydantic validation errors and return a JSON response."""
    return JSONResponse(
        status_code=400, # Bad Request
        content={
            "success": False,
            "error": f"Validation error: {ex.errors()}",
        },
    )

def http_error_handler(request: Request, ex: HTTPException):
    """Override the default HTTPException handler to return a JSON response."""
    return JSONResponse(
        status_code=ex.status_code,
        content={
            "success": False,
            "error": ex.detail,
        },
    )
