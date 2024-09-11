from core import RequestHandler, PagedResult, Mediator
from application.models import DocumentDto
from application.services import PatientService
from domain.entities import Document
from infrastructure import UnitOfWork
from .query import GetPatientDocumentsQuery

@Mediator.register_handler(GetPatientDocumentsQuery)
class GetPatientDocumentsHandler(RequestHandler[GetPatientDocumentsQuery, PagedResult[DocumentDto]]):
    def __init__(
        self,
        uow: UnitOfWork,
        patient_service: PatientService
    ) -> None:
        self.uow = uow
        self.patient_service = patient_service

    def handle(self, req: GetPatientDocumentsQuery) -> PagedResult[DocumentDto]:
        patient = self.patient_service.get_patient(req.patient_id, req.organization)

        if not patient:
            return PagedResult.fail(f"No documents found for patient with ID '{req.patient_id}'")

        document_repo = self.uow.get_repository(Document)

        documents = document_repo.get_list(
            Document.patient_id == patient.id,
            page=req.page,
            page_size=req.page_size,
        )

        documents_count = document_repo.count(Document.patient_id == patient.id)
        documents_dto = [DocumentDto.from_entity(document) for document in documents]

        return PagedResult.succeed(
            documents_dto,
            page_index=req.page,
            page_size=req.page_size,
            items_count=documents_count,
        )
