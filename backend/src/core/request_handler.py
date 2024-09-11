from abc import ABC, abstractmethod
from .result import Result
from .request_interface import IRequest


class RequestHandler[TRequest: IRequest, TResult: Result](ABC):
    """Abstract request handler class"""

    @abstractmethod
    def handle(self, req: TRequest) -> TResult:
        """Handle the given request
        Args:
            req (TRequest): Request to handle
        Returns:
            TResult: Result of the request
        """
        pass
