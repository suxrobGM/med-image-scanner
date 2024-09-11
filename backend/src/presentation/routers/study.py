from typing import Annotated
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from core import Mediator, ResultWithArray, ResultWithData, Result
from application.queries.study.get_studies import GetStudiesQuery
from application.queries.study.get_study_series import GetStudySeriesQuery, GetStudySeriesParams
from application.commands.study.predict_series import PredictSeriesCommand
from application.commands.study.update_predict_status import UpdatePredictStatusPayload
from application.commands.study.update_predict_status import UpdatePredictionStatusCommand
from application.models import StudyDto, SeriesDto
from domain.enums import PredictionStatus
from presentation.routers.auth import jwt_required

study_router = APIRouter(prefix="/studies", tags=["study"])
router = study_router

@router.get("/", responses={400: {"description": "Bad request"}})
async def get_studies(
    query: Annotated[GetStudiesQuery, Depends()],
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithArray[StudyDto]:

    result = mediator.send(query, ResultWithArray[StudyDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{study_id}/series", responses={400: {"description": "Bad request"}})
async def get_study_series(
    study_id: str,
    params: Annotated[GetStudySeriesParams, Depends()],
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithArray[SeriesDto]:

    query = GetStudySeriesQuery(
        study_id=study_id,
        organization=params.organization
    )
    result = mediator.send(query, ResultWithArray[SeriesDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.post("/series/predict", responses={400: {"description": "Bad request"}})
async def predict_series(
    command: PredictSeriesCommand,
    background_tasks: BackgroundTasks,
    #_: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[PredictionStatus]:

    background_tasks.add_task(mediator.send, command, ResultWithData[PredictionStatus])
    result = ResultWithData[PredictionStatus].succeed(PredictionStatus.IN_PROGRESS)
    
    return result

@router.put("/series/{series_id}/status", responses={400: {"description": "Bad request"}})
async def update_series_prediction(
    series_id: str,
    payload: UpdatePredictStatusPayload,
    #_: Annotated[dict, Depends(jwt_required)], # TODO: add machine to machine authentication
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdatePredictionStatusCommand(series_id=series_id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result
