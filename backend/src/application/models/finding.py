from domain.entities import Finding
from .annotation import AnnotationDto
from .base_model import BaseModel

class FindingDto(BaseModel):
    id: str
    title: str
    description: str | None = None
    prediction_probability: float | None = None
    approved: bool | None = None
    report_id: str
    annotation: AnnotationDto | None = None

    @staticmethod
    def from_entity(entity: Finding) -> "FindingDto":
        return FindingDto(
            id=str(entity.id),
            title=entity.title,
            description=entity.description,
            prediction_probability=entity.prediction_probability,
            approved=entity.approved,
            report_id=str(entity.report_id),
            annotation=AnnotationDto.from_entity(entity.annotation) if entity.annotation else None,
        )
