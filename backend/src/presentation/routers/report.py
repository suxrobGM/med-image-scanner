from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from core import Mediator, ResultWithData, Result
from application.models import ReportDto
from application.queries.report.get_report import GetReportQuery
from application.commands.report.bookmark_report import BookmarkReportCommand
from application.commands.report.update_report import UpdateReportPayload, UpdateReportCommand
from presentation.routers.auth import jwt_required

report_router = APIRouter(prefix="/reports", tags=["report"])
router = report_router # Alias for consistency

@router.get("/{id}", responses={400: {"description": "Bad request"}})
async def get_report(
    id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[ReportDto]:

    request = GetReportQuery(id=id)
    result = mediator.send(request, ResultWithData[ReportDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result


@router.post("/bookmark", responses={400: {"description": "Bad request"}})
async def bookmark_report(
    command: BookmarkReportCommand,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.put("/{id}", responses={400: {"description": "Bad request"}})
async def update_report(
    id: str,
    payload: UpdateReportPayload,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdateReportCommand(id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result
