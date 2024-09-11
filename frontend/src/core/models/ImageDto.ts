import {PatientDto} from "./PatientDto";

export interface ImageDto {
  title: string;
  url: string;
  modality: string;
  bodyPart: string;
  series?: string;
  slices?: string;
  createdAt: Date;
  patient: PatientDto;
}
