import logging
from typing import Annotated
from fastapi import BackgroundTasks, Depends, FastAPI, UploadFile
from dto import PredictSeriesQuery, Result, ResultWithData
from services import PredictionService

logging.basicConfig(level=logging.INFO, format="%(levelname)s:    %(message)s")

app = FastAPI()

@app.get("/")
async def root() -> ResultWithData[str]:
    return ResultWithData[str].succeed("API is running")

@app.post("/predict")
async def predict(
    query: Annotated[PredictSeriesQuery, Depends()],
    file: UploadFile, # The zip file containing instances of the series, CT_1.dcm, CT_2.dcm, etc.
    background_tasks: BackgroundTasks,
    prediction_service: Annotated[PredictionService, Depends()],
) -> Result:
    # Save the uploaded file to the temp directory and get the file path
    zip_filepath = prediction_service.save_upload_file(file)

    # Process prediction in the background to avoid blocking the API
    # When the prediction is completed, notify the backend about the status via the API
    background_tasks.add_task(prediction_service.predict, query.model_type, query.series_id, query.modality, query.body_part, zip_filepath)

    return Result.succeed()
