from abc import ABC, abstractmethod
from .event_interface import IEvent


class EventHandler[TEvent: IEvent](ABC):
    """Abstract event handler class"""

    @abstractmethod
    def handle(self, event: TEvent) -> None:
        """Handle the given event
        Args:
            event (TEvent): Event to handle
        """
        pass
