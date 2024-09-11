from domain.entities import Annotation
from .base_model import BaseModel

class AnnotationDto(BaseModel):
    id: str
    title: str
    description: str | None = None
    x: int
    y: int
    location: str | None = None
    width: int
    height: int
    hu: int | None = None
    image_url: str | None = None

    @staticmethod
    def from_entity(entity: Annotation) -> "AnnotationDto":
        return AnnotationDto(
            id=str(entity.id),
            title=entity.title,
            description=entity.description,
            x=entity.x,
            y=entity.y,
            location=entity.location,
            width=entity.width,
            height=entity.height,
            hu=entity.hu,
            image_url=entity.image_url,
        )
