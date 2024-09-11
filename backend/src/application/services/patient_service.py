from uuid import UUID
from core import DIContainer
from application.services import OrganizationService
from application.services.dicom import DicomService, DicomSeries
from application.utils import valid_uuid
from domain.entities import Patient, Study, Organization, Series
from infrastructure import UnitOfWork


@DIContainer.register_scoped()
class PatientService:
    def __init__(
        self,
        uow: UnitOfWork,
        dicom_service: DicomService,
        org_service: OrganizationService,
    ) -> None:
        self._uow = uow
        self._dicom_service = dicom_service
        self._org_service = org_service

    def get_patient(self, patient_id: str, organization_id: str | UUID) -> Patient | None:
        """
        Find a patient by its ID or MRN.
        Args:
            patient_id (str): The ID or MRN of the patient to get.
            organization_id (str): Organization ID or name.
        Returns:
            Organization | None: The organization if found, otherwise None.
        """
        patient_repo = self._uow.get_repository(Patient)

        patient_condition = Patient.id == patient_id if valid_uuid(patient_id) else Patient.mrn == patient_id
        organization_condition = Patient.organization_id == organization_id if valid_uuid(organization_id) else Organization.name == organization_id

        patient = patient_repo.get_one(patient_condition & organization_condition)
        
        return patient
    
    def get_patient_studies(self, patient_id: str, organization_id: str | UUID) -> list[Study]:
        study_repo = self._uow.get_repository(Study)
        patient_condition = Study.patient_id == patient_id if valid_uuid(patient_id) else Patient.mrn == patient_id
        studies = study_repo.get_list(patient_condition and Study.organization_id == organization_id, joins=[Patient])
        return list(studies)
    
    def create_study(
            self,
            study_instance_uid: str,
            organization: Organization,
        ) -> Study:
        """
        Create a new study for a patient and store it in the database. 
        Retrieve the patient information from the DICOM server.
        Args:
            study_instance_uid (str): The study instance UID.
            organization (Organization): The organization to which the patient belongs.
        Returns:
            Study: The created study.
        Raises:
            ValueError: If the organization or patient is not found, or an error occurs while retrieving the study from the DICOM server.
        """

        result = self._dicom_service.get_study(organization.dicom_url, study_instance_uid)

        if not result.success:
            raise ValueError(result.error)
        
        if not result.data:
            raise ValueError(f"Study with ID '{study_instance_uid}' not found")
        
        dicom_study = result.data
        patient = self.get_patient(dicom_study.patient.id, organization.id)

        # Create a new patient if not found
        if not patient:
            patient = Patient(
                mrn=dicom_study.patient.id,
                name=dicom_study.patient.name,
                birth_date=dicom_study.patient.birth_date,
                organization_id=organization.id,
            )
            patient_repo = self._uow.get_repository(Patient)
            patient_repo.add(patient)

        study = Study(
            patient_id=patient.id,
            study_instance_uid=dicom_study.study_instance_uid,
            study_date=dicom_study.study_date,
            description=dicom_study.description,
            modalities=dicom_study.modalities,
            series_count=dicom_study.series,
            instances_count=dicom_study.instances,
            organization_id=organization.id,
        )

        study_repo = self._uow.get_repository(Study)
        study_repo.add(study)
        self._uow.commit()
        return study
    
    def create_series(
            self,
            series_instance_uid: str,
            study: Study,
            organization: Organization,
        ) -> Series:
        """
        Create a new series for a study and store it in the database. 
        Retrieve the series information from the DICOM server.
        Args:
            series_instance_uid (str): The series instance UID.
            study (Study): The study to which the series belongs.
            organization (Organization): The organization to which the patient belongs.
        Returns:
            Series: The created series.
        Raises:
            ValueError: If the study is not found, or an error occurs while retrieving the series from the DICOM server.
        """
        series_repo = self._uow.get_repository(Series)

        result = self._dicom_service.get_series(organization.dicom_url, study.study_instance_uid)

        if not result.success:
            raise ValueError(result.error)
        
        if not result.data:
            raise ValueError(f"Series with ID '{series_instance_uid}' not found")
        
        dicom_series: DicomSeries | None = None

        for series in result.data:
            if series.series_instance_uid == series_instance_uid:
                dicom_series = series
                break

        if not dicom_series:
            raise ValueError(f"Series with ID '{series_instance_uid}' not found")

        series = Series(
            study_id=study.id,
            study_instance_uid=study.study_instance_uid,
            series_instance_uid=dicom_series.series_instance_uid,
            series_number=dicom_series.series_number,
            modality=dicom_series.modality,
            description=dicom_series.description,
            instances_count=dicom_series.instances,
            series_date=dicom_series.series_date,
            body_part=dicom_series.body_part,
        )

        series_repo.add(series)
        self._uow.commit()
        return series
