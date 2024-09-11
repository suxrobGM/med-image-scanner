from sqlalchemy import ColumnElement
from sqlmodel import col, or_
from core import RequestHandler, PagedResult, Mediator
from application.models import PatientDto
from domain.entities import Patient
from infrastructure import UnitOfWork
from .query import GetPatientsQuery


@Mediator.register_handler(GetPatientsQuery)
class GetPatientsHandler(RequestHandler[GetPatientsQuery, PagedResult[PatientDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetPatientsQuery) -> PagedResult[PatientDto]:
        patient_repo = self.uow.get_repository(Patient)
        filter_statement = self._build_filter_statement(req.search)

        patients = patient_repo.get_list(
            filter=filter_statement,
            page=req.page,
            page_size=req.page_size,
            order_by=req.order_by,
        )

        items_count = patient_repo.count(
            filter=filter_statement,
        )

        patients_dto = [PatientDto.from_entity(patient) for patient in patients]

        return PagedResult[PatientDto].succeed(
            data=patients_dto,
            page_index=req.page,
            page_size=req.page_size,
            items_count=items_count,
        )
        
    def _build_filter_statement(self, search: str | None) -> ColumnElement | None:
        if not search:
            return None

        return or_(
            col(Patient.mrn).icontains(search),
            col(Patient.name).icontains(search),
        )

