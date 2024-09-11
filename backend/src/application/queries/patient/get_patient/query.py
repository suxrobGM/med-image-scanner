from core import Query, ResultWithData
from application.models import PatientDto

class GetPatientQueryParams(Query[ResultWithData[PatientDto]]):
    organization: str

class GetPatientQuery(GetPatientQueryParams):
    patient_id: str
