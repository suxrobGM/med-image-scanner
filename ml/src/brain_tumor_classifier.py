
#!pip install tensorflow==2.15.0

from enum import Enum
from typing import Self
import tensorflow as tf
assert tf.__version__ == '2.15.0', 'Please run `pip install tensorflow==2.15.0`'


from tensorflow.keras.models import load_model
tf_model = load_model('./models/brain_tumor_classification.h5')


import cv2
import numpy as np

class BrainTumorClassifier(str, Enum):
    """Brain Tumor Classifier"""
    GLIOMA = "Glioma Tumor"
    NO_TUMOR = "No Tumor"
    MENINGIOMA = "Meningioma Tumor"
    PITUITARY = "Pituitary Tumor"

    @classmethod
    def has_value(cls: type[Self], value: str) -> bool:
        return value in cls._value2member_map_

def classify(image_path: str, model):
    opencvImage = cv2.imread(image_path)
    img = cv2.resize(opencvImage,(150,150))
    img = img.reshape(1,150,150,3)
    p = model.predict(img)
    p = np.argmax(p,axis=1)[0]

    if p==0:
        p='Glioma Tumor'
    elif p==1:
        print('The model predicts that there is no tumor')
    elif p==2:
        p='Meningioma Tumor'
    else:
        p='Pituitary Tumor'

    if p!=1:
        print(f'The Model predicts that it is a {p}')

    return p



#classify("tumor.png", tf_model)

