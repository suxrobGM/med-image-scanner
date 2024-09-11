import {MLModelType} from "./MLModelType";

export interface PredictSeriesCommand {
  organization: string;
  studyInstanceUid: string;
  seriesInstanceUid: string;
  modelType: MLModelType;
  bodyPart?: string;
  predictAgain?: boolean;
}
