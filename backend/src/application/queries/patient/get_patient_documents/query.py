from core import PagedQuery, PagedResult
from application.models import DocumentDto


class GetPatientDocumentsQuery(PagedQuery[PagedResult[DocumentDto]]):
    patient_id: str
    organization: str
