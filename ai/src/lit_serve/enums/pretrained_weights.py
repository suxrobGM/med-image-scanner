from enum import Enum
from pathlib import Path
class DLModelWeights(str, Enum):
    __root_folder__ =  Path(__file__).parent.parent.parent / "models"
    """Weight File Path of ML model"""
    BRAIN_MRI_SEGMENTATION = __root_folder__ / "brain_tumor_segementation_model.hdf5" # brain tumor segmentation model
    BRAIN_MRI_CLASSIFICATION = __root_folder__ / "brain_tumor_classification.h5" # brain tumor classification model
    LUNG_CT = __root_folder__ / "lung_segmentation-best-yolov8-91_map_100_epochs.pt" # lung tumor segmentation model
    CHEST_XRAY = "densenet121-res224-all"
    LLM = "llama3:8b" # Ollama LLM LLama3
