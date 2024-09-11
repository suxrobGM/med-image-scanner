from core import SearchableQuery, PagedResult
from application.models import UserDto


class GetUsersQuery(SearchableQuery[PagedResult[UserDto]]):
    """Query to get a list of users"""

    organization_name: str | None = None
    """Filter users by organization name (optional)."""

    organization_id: str | None = None
    """Filter users by organization ID (optional)."""
