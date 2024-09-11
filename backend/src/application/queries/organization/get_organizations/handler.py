from sqlalchemy import ColumnElement
from sqlmodel import col, or_
from core import RequestHandler, PagedResult, Mediator
from application.models import OrganizationDto
from domain.entities import Organization
from infrastructure import UnitOfWork
from .query import GetOrganizationsQuery


@Mediator.register_handler(GetOrganizationsQuery)
class GetOrganizationsHandler(RequestHandler[GetOrganizationsQuery, PagedResult[OrganizationDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetOrganizationsQuery) -> PagedResult[OrganizationDto]:
        org_repo = self.uow.get_repository(Organization)
        filter_statement = self._build_filter_statement(req.search)

        organizations = org_repo.get_list(
            filter=filter_statement,
            page=req.page,
            page_size=req.page_size,
            order_by=req.order_by,
        )

        items_count = org_repo.count(
            filter=filter_statement,
        )

        organizations_dto = [OrganizationDto.from_entity(org) for org in organizations]

        return PagedResult[OrganizationDto].succeed(
            data=organizations_dto,
            page_index=req.page,
            page_size=req.page_size,
            items_count=items_count,
        )
        
    def _build_filter_statement(self, search: str | None) -> ColumnElement | None:
        if not search:
            return None

        return or_(
            col(Organization.name).icontains(search),
            col(Organization.display_name).icontains(search),
        )

