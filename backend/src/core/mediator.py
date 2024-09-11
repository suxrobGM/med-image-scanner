import uuid
import logging
from typing import Any, Callable, Generator, Self
from .di_container import DIContainer
from .event_interface import IEvent
from .event_handler import EventHandler
from .request_handler import RequestHandler
from .request_interface import IRequest

MessageType = type[IRequest] | type[IEvent]
HandlerType = type[RequestHandler] | type[EventHandler]

class Mediator:
    """
    Mediator class to handle requests and events. 
    It acts as a central hub for handling messages between objects.
    You can send requests and publish events to the mediator.
    It's a singleton class.
    """
    _instance: "Mediator"
    _request_handlers: dict[str, type[RequestHandler]] = {}
    _event_handlers: dict[str, type[EventHandler]] = {}
    _container = DIContainer.get_default()
    _logger = logging.getLogger()

    def __new__(cls: type[Self]) -> "Mediator":
        """Singleton instance of the Mediator class"""
        if not hasattr(cls, "_instance"):
            cls._instance = super().__new__(cls)
        return cls._instance

    def send[T](self, request: IRequest, result_type: type[T]) -> T:
        """
            Send a request to the mediator
        Args:
            message (TRequest): Request to send
            result_type (type[TResult]): Type of the result to return
        Returns:
            TResult: Result of the request
        """
        request_name = type(request).__name__
        handler_class = self._request_handlers.get(request_name)
        
        if handler_class is None:
            raise ValueError(f"No handler registered for {request_name}")
        
        return next(self._resolve_scoped(request, handler_class))
        
    def publish(self, event: IEvent) -> None:
        """
            Publish an event to the mediator
        Args:
            event (TEvent): Event to publish
        """
        event_name = type(event).__name__
        handler_class = self._event_handlers.get(event_name)

        if handler_class is None:
            raise ValueError(f"No handler registered for {event_name}")
        
        return next(self._resolve_scoped(event, handler_class))
            
        
    def register(self, message: MessageType, handler: HandlerType) -> None:
        """
            Register a handler for a message. Message can be either request or event
        Args:
            message (type[IRequest] | type[IEvent]): Message to register
            handler (type[RequestHandler] | type[EventHandler]): Handler to register
        Raises:
            ValueError: Message must be a subclass of IRequest or IEvent
        """
        if issubclass(message, IRequest):
            self._request_handlers[message.__name__] = handler # type: ignore
        elif issubclass(message, IEvent):
            self._event_handlers[message.__name__] = handler # type: ignore
        else:
            raise ValueError("Message must be a subclass of IRequest or IEvent")
        
        self._container.register(handler, handler)

    def unregister(self, message: MessageType) -> None:
        """
            Unregister a handler for a message. Message can be either request or event
        Args:
            message (type[IRequest] | type[IEvent]): Message to unregister
        Raises:
            ValueError: Message must be a subclass of IRequest or IEvent
        """

        handler_class: HandlerType | None = None
        
        if issubclass(message, IRequest):
            handler_class = self._request_handlers.get(message.__name__)
            self._request_handlers.pop(message.__name__)
        elif issubclass(message, IEvent):
            handler_class = self._event_handlers.get(message.__name__)
            self._event_handlers.pop(message.__name__)
        else:
            raise ValueError("Message must be a subclass of IRequest or IEvent")
        
        if handler_class is not None:
            self._container.unregister(handler_class)
    
    def _resolve_scoped(self, request: IRequest | IEvent, handler_class: HandlerType) -> Generator[Any, None, None]:
        """
            Resolve the handler instance in a new scope and handle the request.
        Args:
            request (TRequest): Request to send
            handler (type[RequestHandler]): Handler to use for the request
        Returns:
            TResult: Result of the request
        """
        scope_id = str(uuid.uuid4())

        try:
            self._logger.debug(f"Starting scope: {scope_id}, Request: {type(request).__name__}")
            handler_instance = self._container.resolve(handler_class, scope_id)
            yield handler_instance.handle(request)
        finally:
            self._container.end_scope(scope_id)
            self._logger.debug(f"Finished scope: {scope_id}, Request: {type(request).__name__}")

    @staticmethod
    def register_handler(message_type: MessageType) -> Callable[[HandlerType], HandlerType]:
        """
            Decorator to register a class as a request or event handler in the mediator
        Args:
            message_type (MessageType): Type of message to register the class for handling
        Returns:
            Callable[[HandlerType], HandlerType]: Decorator function
        Raises:
            TypeError: Handler must be a subclass of RequestHandler or EventHandler
        """
        def decorator(handler_class: HandlerType) -> HandlerType:
            # Ensure Mediator class is already defined
            if not issubclass(handler_class, (RequestHandler, EventHandler)):
                raise TypeError("Handler must be a subclass of RequestHandler or EventHandler")

            mediator = Mediator() # Singleton instance of Mediator

            # Register the handler class with the mediator
            mediator.register(message_type, handler_class)
            return handler_class
        return decorator
