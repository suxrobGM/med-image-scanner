from core import DIContainer
from domain.entities import Entity
from .db_context import DbContext
from .repository import Repository

@DIContainer.register_scoped()
class UnitOfWork:
    _repositories: dict[type[Repository], Repository] = {}

    def __init__(self):
        self._session = DbContext.create_session()

    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            self.rollback()
        else:
            self.commit()

        self.dispose()

    def get_repository[T: Entity](self, entity_type: type[T]) -> Repository[T]:
        """
        Get a repository instance for the given entity type.
        It caches the repository instance to avoid creating multiple instances.
        Args:
            entity_type (type[T]): Entity type
        Returns:
            Repository[T]: Repository instance
        """
        if entity_type not in self._repositories:
            self._repositories[entity_type] = Repository[entity_type](self._session, entity_type) # type: ignore
        return self._repositories[entity_type] # type: ignore

    def commit(self):
        """Commit the current transaction"""
        self._session.commit()

    def rollback(self):
        """Rollback the current transaction"""
        self._session.rollback()

    def dispose(self):
        """Dispose the current session"""
        self._repositories.clear()
        self._session.close()

