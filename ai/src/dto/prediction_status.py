from enum import Enum
from typing import Self

class PredictionStatus(str, Enum):
    """Prediction status from the ML model"""
    NOT_STARTED = "not_started" # Default status when the series is created
    IN_PROGRESS = "in_progress" # Model is processing the series
    NOT_SUPPORTED = "not_supported" # Model does not support the modality or body part
    FAILED = "failed" # Model failed to process the series
    COMPLETED = "completed" # Model processing is completed

    @classmethod
    def has_value(cls: type[Self], value: str) -> bool:
        return value in cls._value2member_map_
