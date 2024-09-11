from enum import Enum
# from typing import Self

class LLMPPrompt(str, Enum):
    """Type of ML model"""
    CHEST_XRAY = """
    I am a radiologist and I was checking a lung X-Ray scan for one of my patients and I found that he suffers from {disease}.
    Please explain more about {disease} and its causes. and what is its best treatment in general?
    Don't include illustrating phrases like `I am happy to help` or `Great Diagnosis`
    Go straight to the point and in detail.
    ALL YOUR RESPONSES SHOULD BE IN MARKDOWN FORMAT
    """
    
    
    
    BRAIN_TUMOR = """
    I am a radiologist and I was checking a Brain MRI scan for one of my patients and I found that he suffers from {disease}.
    The size of the tumor is {tumor_area} mm.
    Please explain more about {disease} and its causes. and what is its best treatment in general?
    Don't include illustrating phrases like `I am happy to help` or `Great Diagnosis`
    Go straight to the point and in detail.
    ALL YOUR RESPONSES SHOULD BE IN MARKDOWN FORMAT
    """
    
    LUNG_TUMOR =  """
    I am a radiologist and I was checking a Lung CT scan for one of my patients and I found that he suffers from Lung Tumor.
    The size of the tumor is {tumor_area} mm.
    Please explain more about Lung Tumor and its causes. and what is its best treatment in general?
    Don't include illustrating phrases like `I am happy to help` or `Great Diagnosis`
    Go straight to the point and in detail.
    ALL YOUR RESPONSES SHOULD BE IN MARKDOWN FORMAT
    """
    
