from datetime import datetime
from domain.entities import Document
from .base_model import BaseModel


class DocumentDto(BaseModel):
    id: str
    name: str
    patient_id: str
    description: str | None = None
    url: str
    created_at: datetime

    @staticmethod
    def from_entity(entity: Document) -> "DocumentDto":
        return DocumentDto(
            id=str(entity.id),
            name=entity.name,
            patient_id=str(entity.patient_id),
            description=entity.description,
            url=entity.url,
            created_at=entity.created_at,
        )
