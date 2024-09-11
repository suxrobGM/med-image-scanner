import {AnnotationDto} from "./AnnotationDto";

export interface FindingDto {
  id: string;
  title: string;
  description?: string;
  predictionProbability?: number;
  approved?: boolean;
  annotation?: AnnotationDto;
  reportId: string;
}
