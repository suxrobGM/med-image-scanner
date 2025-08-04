# DL Models API
We are using [LitServe](https://github.com/Lightning-AI/LitServe) to deploy each deep learning model as an API. So that the frontend can communicate with.

# Install the code requirements
```bash
chmod +x setup.sh
./setup.sh
```
# Running all APIs
1. You can interact with the API via the corresponding endpoint declared in [this Enum](./enums/dl_models_endpoints.py)
2. Open the browser and navigate to `API_ENDPOINT/docs` to see the API documentation.
3. to run all the API at once please run the commands below.
```bash
chmod +x run_all_servers.sh
./run_all_servers.sh
```

# Calling API
## X-Ray 
### Request
```Python
import requests

json_data = {
    'folder_path': "/home/azureuser/cloudfiles/code/chest_xray", # The folder containing the X-Ray images
    # Any predictions accuracy lower than this number will be skipped
    # If `accuracy_threshold` not given to the API the default value is 0.6
    "accuracy_threshold": 0.6 
}

response = requests.post('http://localhost:8010/chest_xray', json=json_data)

print(response.json())
```
### Response
- `slice`: The index of the slice that has prediction accuracy higher that the accuracy threshold passed to the API.
- `classification` : The disease name
- `accuracy` : The prediction accuracy
- `llm`: LLM model prediction text about the predicted text in Markdown format.
```JSON
{
   "output":[
      {
         "slice":0,
         "classification":"Lung Opacity | Pneumonia",
         "accuracy":0.6239116191864014
      },
      {
         "slice":2,
         "classification":"Lung Opacity | Pneumonia",
         "accuracy":0.6239116191864014
      },
      {
         "slice":3,
         "classification":"Lung Opacity | Pneumonia",
         "accuracy":0.6239116191864014
      },
      {
         "slice":6,
         "classification":"Lung Opacity | Pneumonia",
         "accuracy":0.6239116191864014
      }
   ],

   "llm": "LLM model prediction text about the predicted text in Markdown format."
}
```

## Abdominal Organs Segmentation (TotalSegmentor) 
### Request
```Python
import requests
json_data = {
    'folder_path': "/home/azureuser/cloudfiles/code/abdominal_organs/kaggle/input/rsna-2023-abdominal-trauma-detection/train_images/10005/18667",
    "task" : "total", # Must be one of these ["total", "total_mr", "body", "vertebrae_body", "appendicular_bones","tissue_types", "tissue_types_mr", "face", "face_mr"]
    "fast" : True
}

response = requests.post('http://0.0.0.0:8040/abdominal', json=json_data)

print(response.json())
```

### Response
- `output`: A zip file encoded as base64 which contains the output folder. It will be None if no the model doesn't output predictions.

```json
{"output": "UEsDBBQAAAAIAJGoKlm...."}
```


## Chest CT (Lung Tumor) 
### Request
```Python
import requests

json_data = {
    'folder_path': "/home/azureuser/cloudfiles/code/LungTumor-Segmentation/test-images",
    # Any predictions accuracy lower than this number will be skipped.
    # if `accuracy_threshold` not given to the API the default value is 0.5
    'accuracy_threshold': 0.7, 
}

response = requests.post('http://0.0.0.0:8030/chest_ct', json=json_data)

print(response.json())
```

### Response
- `output`: The binary file path for the numpy array containing all the masks for every image in the input folder. 
   - The file will be saved in the same input folder given to the API
   - The array shape will be `(number_of_folder_images, 640, 640)` 
- `accuracy`: An array of float numbers the shows the prediciton accuracy for each image, if the accuracy is `-1` this means thhat the image has no predictions.
- `llm`: LLM model prediction text about the predicted text in Markdown format.

> [!CAUTION]
> Please note that all the output masks has the same dimensions `640x640`. So you might need to resize the input image to that dimension to apply the mask on its original input image.

```JSON
{
   "output":"/home/azureuser/cloudfiles/code/LungTumor-Segmentation/test-images/chest_ct_masks.npy",
   "confidence":[
      0.8333001732826233,
      0.6122949719429016,
      -1,
      0.69953852891922,
      0.9274290800094604,
      0.8419352769851685
   ],
   "llm": "LLM model prediction text about the predicted text in Markdown format."
}
```

## Brain MRI 
### Request
```Python
import requests

json_data = {
    # The folder containing the X-Ray images
    'folder_path': "/home/azureuser/cloudfiles/code/llm/niffti_files/BraTS20_Training_001_flair", 
    # Any predictions accuracy lower than this number will be skipped.
    # if `accuracy_threshold` not given to the API the default value is 0.85
    "accuracy_threshold": 0.85 
}

response = requests.post('http://localhost:8020/brain_mri', json=json_data)

print(response.json())
```
### Response
- `output`: The binary file path for the numpy array containing all the masks for every image in the input folder. The array shape will be `(number_of_folder_images, 256, 256, 1)`
- `slice`: The index of the slice that has prediction accuracy higher that the accuracy threshold passed to the API.
- `classification` : The classified tumor type.
- `llm`: LLM model prediction text about the predicted text in Markdown format.

> [!CAUTION]
> Please Ignore the output mask for a specifc slice if the classified tumor type for this slice was `"No Tumor"`

```JSON
{
   "output":"brain_tumor_masks.npy",
   "predictions":[
      {
         "slice":67,
         "classification":"Meningioma Tumor"
      },
      {
         "slice":94,
         "classification":"Meningioma Tumor"
      },
      {
         "slice":96,
         "classification":"Meningioma Tumor"
      },
      {
         "slice":97,
         "classification":"Meningioma Tumor"
      },
      {
         "slice":124,
         "classification":"No Tumor"
      },
      {
         "slice":125,
         "classification":"No Tumor"
      },
      {
         "slice":126,
         "classification":"No Tumor"
      },
      {
         "slice":127,
         "classification":"No Tumor"
      },
      {
         "slice":128,
         "classification":"No Tumor"
      },
      {
         "slice":129,
         "classification":"No Tumor"
      },
      {
         "slice":130,
         "classification":"No Tumor"
      },
      {
         "slice":131,
         "classification":"No Tumor"
      }
   ],
   "llm": "LLM model prediction text about the predicted text in Markdown format."
}
```


## Ollama LLM
### Request
```Python
import requests
prompt = """
I am a radiologist and I was checking a lung X-Ray scan for one of my patients and I found that he suffers from Effusion.
Please explain more about Effusion and its causes. and what is its best treatement in general?
Don't include illustrating phrases like `I am happy to help` or `Great Diagnosis`
Go straight to the point and in detail.
ALL YOUR RESPONSES SHOULD BE IN MARKDOWN FORMAT
"""
json_data = {'input': prompt}

response = requests.post('http://localhost:8000/llm', json=json_data)

print(response.json()['output'])
```
### Response
The response will be MarkDown text like that

```markdown
**What is Effusion?**
Effusion is a medical condition characterized by an abnormal collection of fluid within a bodily cavity. In the context of lung X-ray scans, effusion refers to the accumulation of fluid between the lungs and chest wall (pleural space) or within the lungs themselves (intrapulmonary).

**Causes of Effusion:**

* **Infection**: Pneumonia, tuberculosis, abscesses, or other bacterial infections can cause effusion.
* **Cancer**: Malignancies such as lung cancer, breast cancer, and lymphoma can spread to the pleura and produce fluid accumulation.
* **Autoimmune disorders**: Conditions like rheumatoid arthritis, lupus, and scleroderma can cause inflammation and fluid buildup in the pleural space.
* **Injury or trauma**: Blunt or penetrating chest injuries can lead to effusion.
* **Chronic disease**: Certain conditions like congestive heart failure, cirrhosis, and chronic obstructive pulmonary disease (COPD) can increase the risk of effusion.

**Symptoms:**
Effusion can cause a range of symptoms, including:

* Coughing
* Chest pain or discomfort
* Shortness of breath
* Fatigue
* Fever

**Treatment Options:**

* **Drainage**: Aspiration or thoracentesis may be performed to drain the accumulated fluid.
* **Antibiotics**: For bacterial infections, antibiotics are typically prescribed.
* **Corticosteroids**: In cases of autoimmune disorders, corticosteroids can help reduce inflammation and prevent further fluid accumulation.
* **Chemotherapy**: For cancer-related effusions, chemotherapy or radiation therapy may be necessary to treat the underlying malignancy.
* **Supportive care**: Patients with chronic diseases, such as heart failure or COPD, may require supportive treatments like oxygen therapy, diuretics, or medications to manage their condition.

**Complications:**
Effusion can lead to complications, including:

* **Pneumonia**: Bacterial infections can develop in the accumulated fluid.
* **Fibrinous pleuritis**: The formation of scar tissue and adhesions in the pleural space, which can make future drainage more challenging.
* **Recurrent effusions**: Frequent episodes of effusion can occur if the underlying cause is not addressed.

**Prognosis:**
The prognosis for effusion depends on the underlying cause. In general, prompt treatment and management of the underlying condition can improve outcomes. However, recurrent or chronic effusions may require ongoing management and monitoring to prevent complications.

```

