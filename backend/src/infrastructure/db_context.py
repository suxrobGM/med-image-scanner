from typing import Generator
from sqlmodel import Session, create_engine
from domain.entities import *
from .connection_settings import DbConnectionSettings

class DbContext:
    """Database context class"""

    def __init__(self):
        self.connection_settings = DbConnectionSettings()
        self._engine = create_engine(self.connection_settings.connection_url, echo=False)

    @staticmethod
    def get_session() -> Generator[Session, None, None]:
        """Get a new database session to use in a context manager. It closes the session automatically after use"""
        try:
            session = Session(db_context._engine)
            yield session
        finally:
            session.close()

    @staticmethod
    def create_session() -> Session:
        """Create a new database session without a context manager and need to close it manually"""
        return Session(db_context._engine)

db_context = DbContext()
