from .paged_query import PagedQuery
from .paged_result import PagedResult
from .request_interface import IRequest


class SearchableQuery[TResult: PagedResult](PagedQuery[TResult], IRequest[TResult]):
    """Base query class for searchable requests (e.g. search, filter)
    Args:
        TResult (PagedResult): Result type of the query
    """
    
    search: str | None = None
    """Search term"""
