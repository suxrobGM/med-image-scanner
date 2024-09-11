from datetime import datetime
from uuid import UUID
from application.models import BaseModel
from core import Command, Result

class UpdateFindingPayload(BaseModel):
    id: UUID | None = None
    title: str | None = None
    description: str | None = None
    approved: bool | None = None

class UpdateReportPayload(Command[Result]):
    clinincal_info: str | None = None
    indication: str | None = None
    technique: str | None = None
    impression: str | None = None
    recommendation: str | None = None
    findings: list[UpdateFindingPayload] = []
    referring_physician_id: str | None = None
    signed_at: datetime | None = None

class UpdateReportCommand(UpdateReportPayload):
    id: str
