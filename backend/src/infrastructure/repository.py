from typing import Sequence
from uuid import UUID
from sqlalchemy import ColumnElement
from sqlmodel import Session, select, func
from domain.entities import Entity

class Repository[T: Entity]:
    """
    Generic repository class
    """

    def __init__(self, session: Session, entity_type: type[T]):
        """
        Initialize the repository with the session and entity type
        Args:
            session (Session): SQLAlchemy session
            entity_type (type[T]): Entity type
        """
        self._session = session
        self._entity_type = entity_type

    def count(
            self,
            filter: bool | ColumnElement | None = None,
            joins: list[type[Entity]] | None = None) -> int:
        """
        Count entities in the table
        Args:
            filter (bool | ColumnElement | None): Filter to apply, example: User.email == "johndoe@gmail.com"
            joins (list[type[Entity]] | None): List of entities to join
        Returns:
            int: Number of entities in the repository
        """
        query = select(func.count()).select_from(self._entity_type)

        if joins is not None:
            for join in joins:
                query = query.join(join)

        if filter is not None:
            query = query.where(filter)

        result = self._session.exec(query)
        return result.one_or_none() or 0
    
    def exists(self, filter: bool | ColumnElement) -> bool:
        """
        Check if there exists any entity matching the given criteria
        Args:
            filter (bool | ColumnElement): Filter to apply, example: User.email == "johndoe@gmail.com"
        Returns:
            bool: True if there is any entity, False otherwise
        """
        query = self._construct_query(filter).exists()
        result = self._session.exec(select(query).where(query))
        return result.one_or_none() is not None

    
    def get_one(
            self,
            filter: bool | ColumnElement | None = None,
            joins: list[type[Entity]] | None = None) -> T | None:
        """
        Find an entity in the table with the given criteria
        Args:
            filter (bool | ColumnElement | None): Filter to apply, example: User.email == "johndoe@gmail.com"
            joins (list[type[Entity]] | None): List of entities to join
        Returns:
            T | None: Entity found or None
        """
        query = self._construct_query(filter, joins=joins)
        result = self._session.exec(query)
        return result.first()
    
    def get_by_id(self, id: UUID) -> T | None:
        """
        Find an entity in the table with the given id
        Args:
            id (UUID): ID key of the entity
        Returns:
            T | None: Entity found or None
        """
        return self.get_one(self._entity_type.id == id)

    def get_list(
            self,
            filter: bool | ColumnElement | None = None,
            page: int | None = None,
            page_size: int | None = None,
            order_by: str | None = None,
            joins: list[type[Entity]] | None = None) -> Sequence[T]:
        """
        Get a list of entities in the table, with optional filter, pagination and ordering
        Args:
            filter (bool | ColumnElement | None): Filter to apply, example: User.email == "johndoe@gmail.com"
            page (int | None): Page number to request, starting from 1
            page_size (int | None): Number of items per page
            order_by (str | None): Order by field
            joins (list[type[Entity]] | None): List of entities to join
        Returns:
            Sequence[T]: List of entities in the repository
        """
        query = self._construct_query(filter, joins=joins)

        if page is not None and page_size is not None:
            query = query.limit(page_size).offset((page - 1) * page_size)

        if order_by is not None:
            query = query.order_by(order_by)

        result = self._session.exec(query)
        return result.all()

    def add(self, entity: T) -> T:
        """
        Add an entity to the table
        Args:
            entity (T): Entity to add
        Returns:
            T: Entity added
        """
        self._session.add(entity)
        #self._session.flush()
        #self._session.refresh(entity)
        return entity

    def update(self, entity: T) -> T:
        """
        Update an entity in the table
        Args:
            entity (T): Entity to update
        Returns:
            T: Entity updated
        """
        self._session.add(entity)
        #self._session.flush()
        #self._session.refresh(entity)
        return entity

    def delete_by_id(self, id: UUID) -> None:
        """
        Delete an entity from the table by id
        Args:
            id (UUID): ID key of the entity
        """
        entity = self.get_by_id(id)
        if entity is not None:
            self._session.delete(entity)
            #self._session.flush()

    def _construct_query(
            self,
            where_statement: bool | ColumnElement | None,
            joins: list[type[Entity]] | None = None):
        """
        Construct a query with select statement and with optional where statement and joins
        Args:
            where_statement (bool | None): Where statement to apply, example: User.email == "johndoe@gmail.com"
            joins (list[type[Entity]] | None): List of entities to join
            Returns:
            query: Constructed query
        """
        query = select(self._entity_type)

        if joins is not None:
            for join in joins:
                query = query.join(join)

        if where_statement is not None:
            query = query.where(where_statement)
        return query
