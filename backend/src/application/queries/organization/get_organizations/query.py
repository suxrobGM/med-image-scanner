from core import SearchableQuery, PagedResult
from application.models import OrganizationDto


class GetOrganizationsQuery(SearchableQuery[PagedResult[OrganizationDto]]):
    """Query to get a list of organizations"""
    pass
