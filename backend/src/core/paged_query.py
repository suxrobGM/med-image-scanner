from .query import Query
from .paged_result import PagedResult
from .request_interface import IRequest


class PagedQuery[TResult: PagedResult](Query[TResult], IRequest[TResult]):
    """Base query class for paged requests
    Args:
        TResult (PagedResult): Result type of the query
    """
    
    page: int = 1
    """Page number to request"""
    
    page_size: int = 10
    """Number of items per page"""

    order_by: str | None = None
    """Order by field"""
