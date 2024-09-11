from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from core import Mediator, Result, ResultWithData, ResultWithArray, PagedResult
from application.commands.user.register_user import RegisterUserCommand
from application.commands.user.invite_user import InviteUserCommand
from application.commands.user.update_user_role import UpdateUserRolePayload, UpdateUserRoleCommand
from application.commands.user.update_user_org import UpdateUserOrgPayload, UpdateUserOrgCommand
from application.commands.user.reset_password import ResetPasswordCommand
from application.commands.user.request_password_recovery import RequestPasswordRecoveryCommand
from application.commands.user.update_profile import UpdateUserProfileCommand, UpdateUserProfilePayload
from application.commands.user.update_password.command import UpdateUserPasswordPayload, UpdateUserPasswordCommand
from application.queries.user.get_user import GetUserQuery
from application.queries.user.get_users import GetUsersQuery
from application.queries.user.get_saved_reports import GetUserBookmarkedReportsQuery
from application.queries.user.has_bookmarked_report import UserHasBookmarkedReportQuery
from application.queries.user.search_users import SearchUsersQuery, SearchUsersParams
from application.queries.user.get_user_org import GetUserOrgQuery
from application.models import UserDto, ReportDto, UserShortDetailsDto, OrganizationDto
from presentation.routers.auth import RoleChecker, jwt_required

user_router = APIRouter(prefix="/users", tags=["user"])
router = user_router

@router.get("/", responses={400: {"description": "Bad request"}})
async def get_users(
    query: Annotated[GetUsersQuery, Depends()],
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[UserDto]:

    result = mediator.send(query, PagedResult[UserDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/search/{search_query}", responses={400: {"description": "Bad request"}})
async def search_users(
    search_query: str,
    params: Annotated[SearchUsersParams, Depends()],
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[UserShortDetailsDto]:

    query = SearchUsersQuery(search=search_query, **params.model_dump())
    result = mediator.send(query, PagedResult[UserShortDetailsDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{id}", responses={400: {"description": "Bad request"}})
async def get_user(
    id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[UserDto]:

    query = GetUserQuery(id=id)
    result = mediator.send(query, ResultWithData[UserDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.get("/{id}/organization", responses={400: {"description": "Bad request"}})
async def get_user_organization(
    id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[OrganizationDto]:

    query = GetUserOrgQuery(id=id)
    result = mediator.send(query, ResultWithData[OrganizationDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result


@router.get("/{id}/bookmarked-reports", responses={400: {"description": "Bad request"}})
async def get_bookmarked_reports(
    id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithArray[ReportDto]:

    query = GetUserBookmarkedReportsQuery(user_id=id)
    result = mediator.send(query, ResultWithArray[ReportDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.get("/{id}/bookmarked-reports/{report_id}/exists", responses={400: {"description": "Bad request"}})
async def user_has_bookmarked_report(
    id: str,
    report_id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[bool]:

    query = UserHasBookmarkedReportQuery(user_id=id, report_id=report_id)
    result = mediator.send(query, ResultWithData[bool])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.post("/register", responses={400: {"description": "Bad request"}})
async def register_user(
    command: RegisterUserCommand,
    mediator: Annotated[Mediator, Depends()],
) -> Result:
    
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.post("/invite", responses={400: {"description": "Bad request"}})
async def invite_user(
    command: InviteUserCommand,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.post("/password/recovery", responses={400: {"description": "Bad request"}})
async def request_password_recovery(
    command: RequestPasswordRecoveryCommand,
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.post("/password/reset", responses={400: {"description": "Bad request"}})
async def reset_password(
    command: ResetPasswordCommand,
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.put("/{id}/profile", responses={400: {"description": "Bad request"}})
async def update_user_profile(
    id: str,
    payload: UpdateUserProfilePayload,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdateUserProfileCommand(user_id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.put("/{id}/password", responses={400: {"description": "Bad request"}})
async def update_user_password(
    id: str,
    payload: UpdateUserPasswordPayload,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdateUserPasswordCommand(user_id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.put("/{id}/role", responses={400: {"description": "Bad request"}})
async def update_user_role(
    id: str,
    payload: UpdateUserRolePayload,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdateUserRoleCommand(user_id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result

@router.put("/{id}/organization", responses={400: {"description": "Bad request"}})
async def update_user_organization(
    id: str,
    payload: UpdateUserOrgPayload,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    command = UpdateUserOrgCommand(user_id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result
