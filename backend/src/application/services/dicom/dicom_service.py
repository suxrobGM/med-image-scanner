import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime
from zipfile import ZipFile
from core import DIContainer, ResultWithArray, ResultWithData
from domain.enums import Gender
from .dicom_study import DicomStudy
from .dicom_tag import DicomTag
from .dicom_patient import DicomPatient
from .dicom_value_type import DicomValueType
from .dicom_series import DicomSeries
from .dicom_instance import DicomInstance

@DIContainer.register_singleton()
class DicomService:
    _dicom_content = "application/dicom+json"
    _headers = {"Accept": _dicom_content}

    def verify_qido_support(self, dicom_url: str) -> bool:
        """
        Verify if the DICOM server supports QIDO-RS.
        Args:
            dicom_url (str): The URL of the DICOM server.
        Returns:
            bool: True if QIDO-RS is supported, otherwise False.
        """
        response = requests.get(f"{dicom_url}/studies", headers=self._headers)
        
        return response.status_code == 200 and self._dicom_content in response.headers.get("Content-Type", "")


    def get_patient(self, dicom_url: str, patient_id: str) -> ResultWithData[DicomPatient]:
        """
        Retrieve a patient from the DICOM server by patient ID.
        Args:
            dicom_url (str): The URL of the DICOM server.
            patient_id (str): The patient ID to retrieve.
        Returns:
            ResultWithData[DicomPatient]: A result object containing the patient data.
        """
        # Query the DICOM server for studies associated with the patient ID
        response = requests.get(
            f"{dicom_url}/studies",
            headers=self._headers,
            params={"PatientID": patient_id}
        )

        if response.status_code != 200:
            return ResultWithData.fail(f"Failed to retrieve patient with ID '{patient_id}'. Error: {response.text}")
        
        # Parse the response JSON
        studies_data = response.json()

        if len(studies_data) == 0:
            return ResultWithData.fail(f"Patient with ID '{patient_id}' not found")
        
        study_data = studies_data[0] # Get the first study associated with the patient

        try:
            patient = DicomPatient(
                id=patient_id,
                name=self._get_required_value(study_data, DicomTag.PATIENT_NAME, DicomValueType.ALPHABETIC),
                gender=self._parse_gender(self._get_value(study_data, DicomTag.PATIENT_GENDER)),
                birth_date=self._parse_date(self._get_value(study_data, DicomTag.PATIENT_BIRTH_DATE)),
            )
        except ValueError as e:
            return ResultWithData.fail(f"Failed to parse patient data. Error: {str(e)}")

        return ResultWithData[DicomPatient].succeed(patient)
    
    def get_study(self, dicom_url: str, study_instance_uid: str) -> ResultWithData[DicomStudy]:
        """
        Retrieve a study from the DICOM server by study instance UID.
        Args:
            dicom_url (str): The URL of the DICOM server.
            study_instance_uid (str): The study instance UID to retrieve.
        Returns:
            ResultWithData[DicomStudy]: A result object containing the study data including patient information.
        """
        # Query the DICOM server for the study by StudyInstanceUID
        response = requests.get(
            f"{dicom_url}/studies?StudyInstanceUID={study_instance_uid}",
            headers=self._headers,
            params={
                "includefield": "all",
                "includefield": DicomTag.REQUESTED_PROCEDURE_DESCRIPTION
            }
        )

        if response.status_code != 200:
            return ResultWithData.fail(f"Failed to retrieve study with ID '{study_instance_uid}'. Error: {response.text}")
        
        studies_data = response.json()

        if len(studies_data) == 0:
            return ResultWithData.fail(f"Study with ID '{study_instance_uid}' not found")
        
        study_data = studies_data[0] # Get the first study associated with the StudyInstanceUID

        try:
            patient = DicomPatient(
                id=self._get_required_value(study_data, DicomTag.PATIENT_ID),
                name=self._get_required_value(study_data, DicomTag.PATIENT_NAME, DicomValueType.ALPHABETIC),
                gender=self._parse_gender(self._get_value(study_data, DicomTag.PATIENT_GENDER)),
                birth_date=self._parse_date(self._get_value(study_data, DicomTag.PATIENT_BIRTH_DATE)),
            )

            description = self._get_value(study_data, DicomTag.SERIES_DESCRIPTION)

            if not description:
                description = self._get_value(study_data, DicomTag.REQUESTED_PROCEDURE_DESCRIPTION)

            study = DicomStudy(
                patient=patient,
                study_instance_uid=self._get_required_value(study_data, DicomTag.STUDY_INSTANCE_UID),
                description=description,
                accession_number=self._get_value(study_data, DicomTag.STUDY_ACCESSION_NUMBER),
                study_date=self._parse_date(self._get_value(study_data, DicomTag.STUDY_DATE)),
                modalities=self._get_required_value(study_data, DicomTag.STUDY_MODALITIES, DicomValueType.MULTIPLE),
                series=self._parse_int(self._get_required_value(study_data, DicomTag.STUDY_SERIES)) or 0,
                instances=self._parse_int(self._get_required_value(study_data, DicomTag.STUDY_INSTANCES)) or 0,
            )
        except ValueError as e:
            return ResultWithData.fail(f"Failed to parse study data. Error: {str(e)}")
        
        return ResultWithData[DicomStudy].succeed(study)


    def get_studies(self, dicom_url: str, patient_id: str) -> ResultWithArray[DicomStudy]:
        """
        Retrieve studies associated with a patient from the DICOM server.
        Args:
            dicom_url (str): The URL of the DICOM server.
            patient_id (str): The patient ID to retrieve studies for.
        Returns:
            ResultWithArray[DicomStudy]: A result object containing the list of studies.
        """
        # Query the DICOM server for studies associated with the patient ID
        response = requests.get(
            f"{dicom_url}/studies",
            headers=self._headers,
            params={
                "PatientID": patient_id,
                "includefield": "all",
                "includefield": DicomTag.REQUESTED_PROCEDURE_DESCRIPTION
            }
        )

        if response.status_code != 200:
            return ResultWithArray.fail(f"Failed to retrieve studies for patient ID '{patient_id}'. Error: {response.text}")

        # Parse the response JSON
        studies_data = response.json()
        studies: list[DicomStudy] = []

        if len(studies_data) == 0:
            return ResultWithArray.fail(f"No studies found for patient ID '{patient_id}'")

        try:
            for study_data in studies_data:
                patient = DicomPatient(
                    id=patient_id,
                    name=self._get_required_value(study_data, DicomTag.PATIENT_NAME, DicomValueType.ALPHABETIC),
                    gender=self._parse_gender(self._get_value(study_data, DicomTag.PATIENT_GENDER)),
                    birth_date=self._parse_date(self._get_value(study_data, DicomTag.PATIENT_BIRTH_DATE)),
                )

                description = self._get_value(study_data, DicomTag.SERIES_DESCRIPTION)

                if not description:
                    description = self._get_value(study_data, DicomTag.REQUESTED_PROCEDURE_DESCRIPTION)

                study = DicomStudy(
                    patient=patient,
                    study_instance_uid=self._get_required_value(study_data, DicomTag.STUDY_INSTANCE_UID),
                    description=description,
                    accession_number=self._get_value(study_data, DicomTag.STUDY_ACCESSION_NUMBER),
                    study_date=self._parse_date(self._get_value(study_data, DicomTag.STUDY_DATE)),
                    modalities=self._get_required_value(study_data, DicomTag.STUDY_MODALITIES, DicomValueType.MULTIPLE),
                    series=self._parse_int(self._get_required_value(study_data, DicomTag.STUDY_SERIES)) or 0,
                    instances=self._parse_int(self._get_required_value(study_data, DicomTag.STUDY_INSTANCES)) or 0,
                )
                studies.append(study)
        except ValueError as e:
            return ResultWithArray.fail(f"Failed to parse studies data. Error: {str(e)}")

        return ResultWithArray[DicomStudy].succeed(studies)
    
    def get_series(self, dicom_url: str, study_instance_uid: str) -> ResultWithArray[DicomSeries]:
        """
        Retrieve a list of series associated with a study from the DICOM server.
        Args:
            dicom_url (str): The URL of the DICOM server.
            study_instance_uid (str): The study instance UID to retrieve series for.
        Returns:
            ResultWithArray[DicomSeries]: A result object containing the list of series.
        """
        # Query the DICOM server for series associated with the study ID
        response = requests.get(
            f"{dicom_url}/series",
            headers=self._headers,
            params={
                "StudyInstanceUID": study_instance_uid,
                "includefield": DicomTag.BODY_PART_EXAMINED
            }
        )

        if response.status_code != 200:
            return ResultWithArray.fail(f"Failed to retrieve series for study ID '{study_instance_uid}'. Error: {response.text}")

        # Parse the response JSON
        series_data = response.json()
        series: list[DicomSeries] = []

        if len(series_data) == 0:
            return ResultWithArray.fail(f"No series found for study ID '{study_instance_uid}'")

        try:
            for series_data in series_data:
                series.append(
                    DicomSeries(
                        series_instance_uid=self._get_required_value(series_data, DicomTag.SERIES_INSTANCE_UID),
                        study_instance_uid=self._get_required_value(series_data, DicomTag.STUDY_INSTANCE_UID),
                        series_number=self._parse_int(self._get_required_value(series_data, DicomTag.SERIES_NUMBER)) or 0,
                        modality=self._get_required_value(series_data, DicomTag.MODALITY),
                        description=self._get_value(series_data, DicomTag.SERIES_DESCRIPTION),
                        body_part=self._get_value(series_data, DicomTag.BODY_PART_EXAMINED),
                        instances=self._parse_int(self._get_required_value(series_data, DicomTag.SERIES_INSTANCES)) or 0,
                        series_date=self._parse_date(self._get_value(series_data, DicomTag.SERIES_DATE)),
                    )
                )
        except ValueError as e:
            return ResultWithArray.fail(f"Failed to parse series data. Error: {str(e)}")

        return ResultWithArray[DicomSeries].succeed(series)
    
    def get_instances(self, dicom_url: str, study_instance_id: str, series_instance_id: str) -> ResultWithArray[DicomInstance]:
        """
        Retrieve instances associated with a series from the DICOM server.
        Args:
            dicom_url (str): The URL of the DICOM server.
            study_instance_id (str): The study instance UID to retrieve instances for.
            series_instance_id (str): The series instance UID to retrieve instances for.
        Returns:
            ResultWithArray[DicomInstance]: A result object containing the list of instances.
        """
        # Query the DICOM server for instances associated with the series ID
        response = requests.get(
            f"{dicom_url}/studies/{study_instance_id}/series/{series_instance_id}/instances",
            headers=self._headers,
        )

        if response.status_code != 200:
            return ResultWithArray.fail(f"Failed to retrieve instances for series ID '{series_instance_id}'. Error: {response.text}")

        # Parse the response JSON
        instances_data = response.json()
        instances: list[DicomInstance] = []

        if len(instances_data) == 0:
            return ResultWithArray.fail(f"No instances found for series ID '{series_instance_id}'")

        try:
            for instance_data in instances_data:
                instances.append(
                    DicomInstance(
                        sop_instance_uid=self._get_required_value(instance_data, DicomTag.SOP_INSTANCE_UID),
                        study_instance_uid=self._get_required_value(instance_data, DicomTag.STUDY_INSTANCE_UID),
                        series_instance_uid=self._get_required_value(instance_data, DicomTag.SERIES_INSTANCE_UID),
                        modality=self._get_required_value(instance_data, DicomTag.MODALITY),
                        instance_number=self._parse_int(self._get_required_value(instance_data, DicomTag.INSTANCE_NUMBER)) or 0,
                        retrieve_url=self._get_required_value(instance_data, DicomTag.RETRIEVE_URL),
                    )
                )
        except ValueError as e:
            return ResultWithArray.fail(f"Failed to parse instances data. Error: {str(e)}")

        return ResultWithArray[DicomInstance].succeed(instances)
    
    def download_and_zip_instances(self, dicom_url: str, study_instance_id: str, series_instance_id: str) -> ResultWithData[str]:
        """
        Download and zip instances associated with a series from the DICOM server.
        Args:
            dicom_url (str): The URL of the DICOM server.
            study_instance_id (str): The study instance UID to retrieve instances for.
            series_instance_id (str): The series instance UID to retrieve instances for.
        Returns:
            ResultWithData[str]: A result object containing the path to the zipped file.
        """
        result = self.get_instances(dicom_url, study_instance_id, series_instance_id)

        if not result.success and result.error:
            return ResultWithData.fail(result.error)
        
        instances = result.data or []

        if not os.path.exists("temp"):
            os.mkdir("temp")

        zip_file_path = f"temp/dicom_{study_instance_id}_{series_instance_id}.zip"

        # Don't re-download the file if it already exists
        if os.path.exists(zip_file_path):
            return ResultWithData[str].succeed(zip_file_path)
        
        def download_instance(instance: DicomInstance) -> tuple[str, bytes]:
            """Helper method to download a DICOM instance."""
            response = requests.get(instance.retrieve_url)

            if response.status_code == 200:
                instance_name = f"{instance.modality}_{instance.instance_number}.dcm"
                return instance_name, response.content
            else:
                raise ValueError(f"Failed to download instance '{instance.sop_instance_uid}' from retrieve URL '{instance.retrieve_url}'")

        # Download and zip the instances concurrently using a ThreadPoolExecutor
        with ThreadPoolExecutor() as executor, ZipFile(zip_file_path, "w") as zip_file:
            future_to_instance = {executor.submit(download_instance, instance): instance for instance in instances}
            for future in as_completed(future_to_instance):
                try:
                    instance_name, content = future.result()
                    zip_file.writestr(instance_name, content) # Write the instance content to the zip file
                except Exception as e:
                    return ResultWithData.fail(str(e))

        return ResultWithData[str].succeed(zip_file_path)

    def _get_value(self, dataset: dict, tag: DicomTag, value_type = DicomValueType.SINGLE) -> str | None:
        """
        Helper method to extract a DICOM tag value from the dataset.
        Returns None if the tag is not found.
        """
        if tag.value not in dataset:
            return None

        if value_type == DicomValueType.ALPHABETIC:
            return dataset.get(tag.value, {}).get("Value", [])[0].get("Alphabetic", None)
        elif value_type == DicomValueType.IDEOGRAPHIC:
            return dataset.get(tag.value, {}).get("Value", [])[0].get("Ideographic", None)
        elif value_type == DicomValueType.PHONETIC:
            return dataset.get(tag.value, {}).get("Value", [])[0].get("Phonetic", None)
        elif value_type == DicomValueType.MULTIPLE:
            return " ".join(dataset.get(tag.value, {}).get("Value", []))
        else:
            return dataset.get(tag.value, {}).get("Value", [None])[0]
    
    def _get_required_value(self, dataset: dict, tag: DicomTag, value_type = DicomValueType.SINGLE) -> str:
        """
        Helper method to extract a required DICOM tag value from the dataset.
        Raises a ValueError if the tag is not found.
        """
        value = self._get_value(dataset, tag, value_type)
        if not value:
            raise ValueError(f"Tag '{tag.value}' not found in the DICOM dataset")

        return value
    
    def _parse_gender(self, gender_str: str | None) -> Gender | None:
        """Helper method to parse a patient sex from a DICOM field."""
        if gender_str == "F":
            return Gender.FEMALE
        elif gender_str == "M":
            return Gender.MALE
        elif gender_str == "O":
            return Gender.OTHER
        return None

    def _parse_date(self, date_str: str | None) -> date | None:
        """Helper method to parse a DICOM date string."""
        if not date_str:
            return None

        return datetime.strptime(date_str, "%Y%m%d").date()
    
    def _parse_int(self, int_str: str | None) -> int | None:
        """Helper method to extract and parse an integer DICOM field."""
        if not int_str:
            return None
        
        return int(int_str)
