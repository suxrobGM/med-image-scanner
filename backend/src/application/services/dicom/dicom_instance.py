from pydantic import BaseModel

class DicomInstance(BaseModel):
    series_instance_uid: str
    study_instance_uid: str
    sop_instance_uid: str
    modality: str
    retrieve_url: str
    instance_number: int
