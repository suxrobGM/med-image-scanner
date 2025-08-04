from pydantic import BaseModel as PydanticBaseModel
from pydantic.alias_generators import to_camel


class BaseModel(PydanticBaseModel):
    """Base model class"""
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "protected_namespaces": (),
    }
