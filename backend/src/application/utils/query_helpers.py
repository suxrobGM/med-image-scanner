from sqlalchemy import ColumnElement
from sqlmodel import and_, col, or_
from domain.entities import User, Organization

def build_user_filter_query(
        search: str | None,
        organization_name: str | None = None,
        organization_id: str | None = None
    ) -> ColumnElement | None:
    """Builds a query to filter users by search and organization name or ID.
    Search query can be part of the user's email, first name, or last name.
    Args:
        search (str | None): Search query.
        organization_name (str | None): Organization name.
        organization_id (str | None): Organization ID.
    Returns:
        ColumnElement | None: Query to filter users.
    """

    filters = []

    if search:
        filters.append(or_(
            col(User.email).icontains(search),
            col(User.first_name).icontains(search),
            col(User.last_name).icontains(search),
        ))

    if organization_name:
        filters.append(and_(
            col(User.organization_id).isnot(None),
            col(Organization.name) == organization_name
        ))
    elif organization_id:
        filters.append(col(User.organization_id) == organization_id)

    if not filters:
        return None

    return and_(*filters)
