import json
import streamlit as st
import cv2
import matplotlib.pyplot as plt
import numpy as np
import skimage
import skimage.io
import torch
import torch.nn.functional as F
import torchvision
import torchxrayvision as xrv
from torchvision.transforms import Compose

# Set page configuration
st.set_page_config(layout="wide", initial_sidebar_state="collapsed", )
WEIGHTS = "densenet121-res224-all"
MODEL = xrv.models.get_model(WEIGHTS) # Load the model into memory during startup

class XRayPredictResult:
    pneumonia: float = 0.0
    lung_opacity: float = 0.0
    edema: float = 0.0
    effusion: float = 0.0
    enlarged_cardiomediastinum: float = 0.0
    atelectasis: float = 0.0
    emphysema: float = 0.0
    consolidation: float = 0.0
    fracture: float = 0.0
    lung_lesion: float = 0.0
    infiltration: float = 0.0
    cardiomegaly: float = 0.0
    mass: float = 0.0
    fibrosis: float = 0.0
    pneumothorax: float = 0.0
    nodule: float = 0.0
    hernia: float = 0.0
    pleural_thickening: float = 0.0

    def __str__(self) -> str:
        return json.dumps(self.__dict__, indent=2)
    
    def to_json(self) -> str:
        return json.dumps(self.__dict__)
    
    def to_dict(self) -> dict[str, float]:
        return self.__dict__
    
    def get_diseases(self, threshold=0.7) -> dict[str, float]:
        """
        Get the diseases with a probability greater than the threshold.
        Args:
            threshold: The threshold value. Default is 0.7.
        Returns:
            dict[str, float]: The diseases with probability greater than the threshold.
        """
        return {k: v for k, v in self.to_dict().items() if v > threshold}

    @staticmethod
    def from_dict(d: dict[str, np.float32]) -> "XRayPredictResult":
        """Create an instance of XRayPredictResult from a dictionary."""
        result = XRayPredictResult()
        for k, v in d.items():
            if k == "Pneumonia":
                result.pneumonia = v.item()
            elif k == "Lung Opacity":
                result.lung_opacity = v.item()
            elif k == "Edema":
                result.edema = v.item()
            elif k == "Effusion":
                result.effusion = v.item()
            elif k == "Enlarged Cardiomediastinum":
                result.enlarged_cardiomediastinum = v.item()
            elif k == "Atelectasis":
                result.atelectasis = v.item()
            elif k == "Emphysema":
                result.emphysema = v.item()
            elif k == "Consolidation":
                result.consolidation = v.item()
            elif k == "Fracture":
                result.fracture = v.item()
            elif k == "Lung Lesion":
                result.lung_lesion = v.item()
            elif k == "Infiltration":
                result.infiltration = v.item()
            elif k == "Cardiomagaly":
                result.cardiomegaly = v.item()
            elif k == "Mass":
                result.mass = v.item()
            elif k == "Fibrosis":
                result.fibrosis = v.item()
            elif k == "Pneumothorax":
                result.pneumothorax = v.item()
            elif k == "Nodule":
                result.nodule = v.item()
            elif k == "Hernia":
                result.hernia = v.item()
            elif k == "Pleural Thickening":
                result.pleural_thickening = v.item()
        return result


def plot(output: list[tuple[str, float]]):
    predictions = sorted(output, key=lambda x: x[0])  # sort by name
    # Create a figure with a specific size
    fig, axs = plt.subplots(nrows=len(predictions), ncols=1, figsize=(18, 9), sharex=True)
    plt.subplots_adjust(left=0, right=1, top=0.85, bottom=0, hspace=0.8)

    # Create the gradient
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    gradient = np.vstack((gradient, gradient))
    X_LIMIT = 50
    # Display the gradient for each row as a separate axis
    for i, ax in enumerate(axs):
        ax.imshow(gradient, aspect='auto', cmap='RdYlGn_r', extent=[0, X_LIMIT, 0, 1])  # Extending width
        name, accuracy = predictions[i]
        ax.text(-15, 0.15, f"{name} ({accuracy*100:.2f}%)", fontsize=12, fontweight='bold')

        ax.set_xlim(0, X_LIMIT)
        ax.set_ylim(0, 1)
        ax.set_xticks([])
        ax.set_yticks([])

        # Add a circle in each row
        circle = plt.Circle((accuracy*X_LIMIT, 0.5), 0.2, color='black', ec='black')
        ax.add_patch(circle)

        # Remove spines
        for spine in ax.spines.values():
            spine.set_visible(False)

    # Ensure aspect ratio is equal for all subplots
    for ax in axs:
        ax.set_aspect('equal')

    # Add labels for Safe, Normal, and Risk
    fig.text(.173,  0.87, 'Safe', ha='center', va='center', fontsize=12)
    fig.text(0.5,  0.87, 'Normal', ha='center', va='center', fontsize=12)
    fig.text(0.827, 0.87, 'Risk', ha='center', va='center', fontsize=12)

    # Add a header
    # fig.suptitle('Prediction', fontsize=16, fontweight='bold', ha='center')

    # Display the plot
    # plt.show()
    st.pyplot(fig)
    return fig


def predict_skimage(img_path: str, calc_feats=False) -> XRayPredictResult:
    global MODEL
    img = skimage.io.imread(img_path)
    img = xrv.datasets.normalize(img, 255)

    # Check that images are 2D arrays
    if len(img.shape) > 2:
        img = img[:, :, 0]
    if len(img.shape) < 2:
        print("error, dimension lower than 2 for image")

    # Add color channel
    img = img[None, :, :]

    # the models will resize the input to the correct size so this is optional.
    if 224 not in img.shape[1:]:
        transform = Compose([xrv.datasets.XRayCenterCrop(), xrv.datasets.XRayResizer(224)])
    else:
        transform = Compose([xrv.datasets.XRayCenterCrop()])

    img = transform(img)

    output = {}
    with torch.no_grad():
        img = torch.from_numpy(img).unsqueeze(0)

        if torch.cuda.is_available():
            img = img.cuda()
            MODEL = MODEL.cuda()

        #  What is this for? TODO: maybe add appropriate properties to the XRayPredicResult class for this output
        if calc_feats:
            feats = MODEL.features(img)
            feats = F.relu(feats, inplace=True)
            feats = F.adaptive_avg_pool2d(feats, (1, 1))
            output["feats"] = list(feats.cpu().detach().numpy().reshape(-1))

        preds = MODEL(img).cpu()
        output["preds"] = dict(
            sorted(zip(MODEL.pathologies, preds[0].detach().numpy()),
                   key=lambda x: x[1],
                   reverse=True))

        return XRayPredictResult.from_dict(output["preds"])


def predict_cv2(image_path: str, model_weights='densenet121-res224-all'):
    img = cv2.imread(image_path)
    img = xrv.datasets.normalize(img, 255)
    if len(img.shape) > 2:
        img = img.mean(2)[None, ...]

    transform = torchvision.transforms.Compose([
        xrv.datasets.XRayCenterCrop(),
        xrv.datasets.XRayResizer(224, engine='cv2')
    ])

    img = transform(img)
    img = torch.from_numpy(img)

    model = xrv.models.DenseNet(weights=model_weights)
    outputs = model(img[None, ...])

    res = sorted(zip(model.pathologies, outputs[0].detach().numpy()), key=lambda x: x[1], reverse=True)

    prediction = f"{res[0][0]} | {res[1][0]}"
    other_predictions = dict(res[2:])

    return prediction, other_predictions

