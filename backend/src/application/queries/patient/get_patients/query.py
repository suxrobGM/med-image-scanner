from core import SearchableQuery, PagedResult
from application.models import PatientDto


class GetPatientsQuery(SearchableQuery[PagedResult[PatientDto]]):
    """Query to get a list of patients"""
    pass
