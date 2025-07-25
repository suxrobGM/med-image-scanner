import {FindingDto} from "./FindingDto";
import {PatientDto} from "../PatientDto";
import {UserDto} from "../user";

export interface ReportDto {
  id: string;
  title: string;
  clinincalInfo?: string;
  indication?: string;
  technique?: string;
  impression?: string;
  recommendation?: string;
  patient: PatientDto;
  seriesId: string;
  seriesInstanceUid: string;
  studyInstanceUid: string;
  modality: string;
  findings: FindingDto[];
  signedAt?: string;
  referringPhysician?: UserDto;
  createdAt: string;
}
