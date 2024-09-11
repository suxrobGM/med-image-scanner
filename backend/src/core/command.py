from pydantic import BaseModel
from pydantic.alias_generators import to_camel
from .result import Result
from .request_interface import IRequest


class Command[TResult: Result](BaseModel, IRequest[TResult]):
    """Base command class
    Args:
        TResult (Result): Result type of the command
    """
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "protected_namespaces": (),
    }
