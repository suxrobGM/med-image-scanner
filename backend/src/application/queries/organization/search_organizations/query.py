from core import PagedQuery, PagedResult
from application.models import OrgShortDetailsDto

class SearchOrganizationsParams(PagedQuery[PagedResult[OrgShortDetailsDto]]):
    pass

class SearchOrganizationsQuery(SearchOrganizationsParams):
    search: str
