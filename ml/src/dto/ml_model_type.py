from enum import Enum

class MLModelType(str, Enum):
    """Type of ML model"""
    CHEST_XRAY_CLASSIFICATION = "chest_xray_classification"
    BRAIN_TUMOR_SEGMENTATION = "brain_tumor_segmentation"
    LUNG_TUMOR_SEGMENTATION = "lung_tumor_segmentation"
    ABDOMINAL_ORGANS_SEGMENTATION = "abdominal_organs_segmentation"
