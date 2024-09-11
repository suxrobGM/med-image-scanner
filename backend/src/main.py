import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from core import ResultWithData
from presentation.exception_handlers import http_error_handler, validation_error_handler
from presentation.routers import auth_router, api_router

logging.basicConfig(level=logging.INFO, format="%(levelname)s:    %(message)s")

app = FastAPI()
app.include_router(api_router)
app.include_router(auth_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"])
app.add_exception_handler(ValidationError, validation_error_handler) # type: ignore
app.add_exception_handler(HTTPException, http_error_handler) # type: ignore

@app.get("/")
def root() -> ResultWithData[str]:
    return ResultWithData[str].succeed("API is running")
