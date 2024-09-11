from enum import Enum

class DicomValueType(int, Enum):
    SINGLE = 1
    MULTIPLE = 2
    ALPHABETIC = 3
    IDEOGRAPHIC = 4
    PHONETIC = 5
