import {PredictionStatus} from "./PredictionStatus";

export interface SeriesDto {
  id: string;
  studyInstanceUid: string;
  seriesInstanceUid: string;
  seriesNumber: number;
  modality: string;
  description?: string;
  bodyPart?: string;
  instancesCount: number;
  seriesDate?: string;
  predictionStatus: PredictionStatus;
  predictionAccuracy?: number;
  predictionOutputFile?: string;
  reportId?: string;
}
