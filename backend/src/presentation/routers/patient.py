from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from core import Mediator, ResultWithData, PagedResult, PagedQuery
from application.models import DocumentDto, PatientDto
from application.queries.patient.get_patient import GetPatientQuery, GetPatientQueryParams
from application.queries.patient.get_patient_documents import GetPatientDocumentsQuery
from application.queries.patient.get_patients import GetPatientsQuery
from presentation.routers.auth import jwt_required

patient_router = APIRouter(prefix="/patients", tags=["patient"])
router = patient_router

@router.get("/", responses={400: {"description": "Bad request"}})
async def get_patients(
    query: Annotated[GetPatientsQuery, Depends()],
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[PatientDto]:

    result = mediator.send(query, PagedResult[PatientDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{id}", responses={400: {"description": "Bad request"}})
async def get_patient(
    id: str,
    params: Annotated[GetPatientQueryParams, Depends()],
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[PatientDto]:

    query = GetPatientQuery(patient_id=id, organization=params.organization)
    result = mediator.send(query, ResultWithData[PatientDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{id}/documents", responses={400: {"description": "Bad request"}})
async def get_patient_documents(
    id: str,
    paged_query: Annotated[PagedQuery, Depends()],
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[DocumentDto]:

    query = GetPatientDocumentsQuery(
        patient_id=id,
        page=paged_query.page,
        page_size=paged_query.page_size,
        order_by=paged_query.order_by,
    )
    result = mediator.send(query, PagedResult[DocumentDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result
