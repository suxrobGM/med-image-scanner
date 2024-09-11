from enum import Enum
from typing import Self

class MLModelType(str, Enum):
    """Type of ML model"""
    CHEST_XRAY_CLASSIFICATION = "chest_xray_classification"
    BRAIN_TUMOR_CLASSIFICATION = "brain_tumor_classification"
    BRAIN_TUMOR_SEGMENTATION = "brain_tumor_segmentation"
    LUNG_TUMOR_SEGMENTATION = "lung_tumor_segmentation"
    ABDOMINAL_ORGANS_SEGMENTATION = "abdominal_organs_segmentation"

    @classmethod
    def has_value(cls: type[Self], value: str) -> bool:
        return value in cls._value2member_map_
