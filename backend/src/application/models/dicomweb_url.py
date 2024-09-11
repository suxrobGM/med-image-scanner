from .base_model import BaseModel

class DicomWebUrlDto(BaseModel):
    wado_uri_root: str
    qido_root: str
    wado_root: str
