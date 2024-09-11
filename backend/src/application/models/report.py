from datetime import datetime
from domain.entities import Report
from .base_model import BaseModel
from .finding import FindingDto
from .patient import PatientDto
from .user import UserDto

class ReportDto(BaseModel):
    id: str
    clinincal_info: str | None = None
    indication: str | None = None
    technique: str | None = None
    impression: str | None = None
    recommendation: str | None = None
    patient: PatientDto
    series_id: str
    series_instance_uid: str
    study_instance_uid: str
    modality: str
    findings: list[FindingDto] = []
    referring_physician: UserDto | None = None
    signed_at: datetime | None = None
    created_at: datetime

    @staticmethod
    def from_entity(entity: Report) -> "ReportDto":
        findings = [
            FindingDto.from_entity(finding)
            for finding in entity.findings
        ]

        return ReportDto(
            id=str(entity.id),
            clinincal_info=entity.clinincal_info,
            indication=entity.indication,
            technique=entity.technique,
            impression=entity.impression,
            recommendation=entity.recommendation,
            patient=PatientDto.from_entity(entity.patient),
            series_id=str(entity.series_id),
            series_instance_uid=entity.series.series_instance_uid,
            study_instance_uid=entity.series.study_instance_uid,
            signed_at=entity.signed_at,
            created_at=entity.created_at,
            referring_physician=UserDto.from_entity(entity.referring_physician) if entity.referring_physician else None,
            findings=findings,
            modality=entity.series.modality,
        )
