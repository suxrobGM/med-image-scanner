from core import PagedQuery, PagedResult
from application.models import UserShortDetailsDto

class SearchUsersParams(PagedQuery[PagedResult[UserShortDetailsDto]]):
    organization: str | None = None
    """Filter users by organization name (optional)."""

class SearchUsersQuery(SearchUsersParams):
    search: str
