import unittest
from unittest.mock import MagicMock
from uuid import UUID
from sqlmodel import Session
from app.domain.entities import Entity
from app.infrastructure.repository import Repository

class TestRepository(unittest.TestCase):
    def setUp(self):
        self.session = MagicMock(spec=Session)
        self.entity_type = MagicMock(spec=Entity)
        self.repository = Repository(self.session, self.entity_type)

    def test_count_with_no_filter(self):
        # Arrange
        expected_count = 5
        self.session.exec.return_value.count.return_value.scalar_one.return_value = expected_count

        # Act
        count = self.repository.count()

        # Assert
        self.assertEqual(count, expected_count)
        self.session.exec.assert_called_once()
        self.session.exec.return_value.count.assert_called_once()

    def test_get_one_with_no_filter(self):
        # Arrange
        expected_entity = MagicMock(spec=self.entity_type)
        self.session.exec.return_value.first.return_value = expected_entity

        # Act
        entity = self.repository.get_one()

        # Assert
        self.assertEqual(entity, expected_entity)
        self.session.exec.assert_called_once()
        self.session.exec.return_value.first.assert_called_once()

    def test_get_by_id(self):
        # Arrange
        id = UUID("123e4567-e89b-12d3-a456-426614174000")
        expected_entity = MagicMock(spec=self.entity_type)
        self.repository.get_one = MagicMock(return_value=expected_entity)

        # Act
        entity = self.repository.get_by_id(id)

        # Assert
        self.assertEqual(entity, expected_entity)
        self.repository.get_one.assert_called_once_with(self.entity_type.id == id)


if __name__ == "__main__":
    unittest.main()
