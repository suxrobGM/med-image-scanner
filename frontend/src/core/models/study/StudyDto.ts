import {PatientDto} from "../PatientDto";

export interface StudyDto {
  id: string;
  studyInstanceUid: string;
  accessionNumber?: string;
  studyDate?: string;
  description?: string;
  modalities: string;
  seriesCount: number;
  instancesCount: number;
  patient: PatientDto;
}
