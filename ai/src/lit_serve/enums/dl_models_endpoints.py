from enum import Enum

class DLModelEndpoint(str, Enum):
    """Type of ML model"""
    CHEST_XRAY = "http://localhost:8010/chest_xray" # Chest X-ray Classification model
    BRAIN_MRI = "http://localhost:8020/brain_mri" # brain tumor segmenation model
    LUNG_CT = "http://localhost:8030/chest_ct" # lung tumor segmenation model
    ABDOMINAL_ORGANS_SEGMENTATION = "http://localhost:8040/abdominal" # TotalSegmentor abdominal organs segmentation model
    LLM = "http://localhost:8050/llm" # Ollama LLM LLama3
