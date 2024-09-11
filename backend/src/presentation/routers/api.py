from fastapi import APIRouter
from .patient import patient_router
from .report import report_router
from .user import user_router
from .organization import organization_router
from .study import study_router

api_router = APIRouter(prefix="/api")
api_router.include_router(user_router)
api_router.include_router(patient_router)
api_router.include_router(report_router)
api_router.include_router(organization_router)
api_router.include_router(study_router)
