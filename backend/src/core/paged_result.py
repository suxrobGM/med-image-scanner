from math import ceil
from .result import Result


class PagedResult[TData](Result):
    """Result class to represent the output of a paged request."""

    data: list[TData] = []
    """List of items in the current page"""

    page_index: int = 0
    """Current page index"""
    
    page_size: int = 0
    """Number of items per page"""

    pages_count: int = 0
    """Total number of available pages"""

    @staticmethod
    def succeed(
        data: list[TData],
        page_index: int,
        page_size: int,
        items_count: int) -> "PagedResult[TData]":
        """Return a successful result with items and pagination info
        Args:
            items (list[TData]): List of items in the current page
            page_index (int): Current page index
            page_size (int): Number of items per page
            items_count (int): Total number of items in the table filtered by the query
        """
        pages_count = ceil(items_count / page_size)
        return PagedResult[TData](
            success=True,
            data=data,
            page_index=page_index,
            page_size=page_size,
            pages_count=pages_count,
        )
    
    @staticmethod
    def fail(error: str | None) -> "PagedResult[TData]":
        """Return a failed result"""
        return PagedResult[TData](success=False, error=error or "An error occurred")
