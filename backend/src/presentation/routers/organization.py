from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from core import Mediator, ResultWithData, Result, PagedResult
from application.models import OrganizationDto, OrgShortDetailsDto
from application.models.dicomweb_url import DicomWebUrlDto
from application.queries.organization.get_organization import GetOrganizationQuery
from application.queries.organization.get_organizations import GetOrganizationsQuery
from application.queries.organization.search_organizations import SearchOrganizationsQuery, SearchOrganizationsParams
from application.queries.organization.get_dicomweb_url import GetOrgDicomWebUrlQuery
from application.commands.organization.create_organization import CreateOrganizationCommand
from application.commands.organization.update_organization import UpdateOrganizationCommand, UpdateOrganizationPayload
from application.commands.organization.delete_organization import DeleteOrganizationCommand
from application.commands.organization.invite_to_org import InviteToOrgCommand
from application.commands.organization.join_organization import JoinOrganizationCommand
from presentation.routers.auth import RoleChecker, jwt_required

organization_router = APIRouter(prefix="/organizations", tags=["organization"])
router = organization_router # Alias for consistency

@router.get("/", responses={400: {"description": "Bad request"}})
async def get_organizations(
    query: Annotated[GetOrganizationsQuery, Depends()],
    _: Annotated[bool, Depends(RoleChecker.app_admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[OrganizationDto]:

    result = mediator.send(query, PagedResult[OrganizationDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/search/{search_query}", responses={400: {"description": "Bad request"}})
async def search_organizations(
    search_query: str,
    params: Annotated[SearchOrganizationsParams, Depends()],
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> PagedResult[OrgShortDetailsDto]:

    query = SearchOrganizationsQuery(search=search_query, **params.model_dump())
    result = mediator.send(query, PagedResult[OrgShortDetailsDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{id}", responses={400: {"description": "Bad request"}})
async def get_organization(
    id: str,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[OrganizationDto]:

    query = GetOrganizationQuery(id=id)
    result = mediator.send(query, ResultWithData[OrganizationDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/{id}/dicomweb", responses={400: {"description": "Bad request"}})
async def get_org_dicomweb_url(
    id: str,
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[DicomWebUrlDto]:

    query = GetOrgDicomWebUrlQuery(org_id=id)
    result = mediator.send(query, ResultWithData[DicomWebUrlDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.post("/invite", responses={400: {"description": "Bad request"}})
async def invite_to_organization(
    command: InviteToOrgCommand,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.post("/join", responses={400: {"description": "Bad request"}})
async def join_to_organization(
    command: JoinOrganizationCommand,
    _: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.post("/", responses={400: {"description": "Bad request"}})
async def create_organization(
    command: CreateOrganizationCommand,
    _: Annotated[bool, Depends(RoleChecker.app_admins_only)],
    mediator: Annotated[Mediator, Depends()],
) -> Result:

    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.put("/{id}", responses={400: {"description": "Bad request"}})
async def update_organization(
    id: str,
    payload: UpdateOrganizationPayload,
    _: Annotated[bool, Depends(RoleChecker.admins_only)],
    mediator: Annotated[Mediator, Depends()]) -> Result:

    command = UpdateOrganizationCommand(id=id, **payload.model_dump())
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.delete("/{id}", responses={400: {"description": "Bad request"}})
async def delete_organization(
    id: str,
    _: Annotated[bool, Depends(RoleChecker.app_admins_only)],
    mediator: Annotated[Mediator, Depends()]) -> Result:

    command = DeleteOrganizationCommand(id=id)
    result = mediator.send(command, Result)

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result
