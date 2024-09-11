import {UpdateFindingCommand} from "./UpdateFindingCommand";

export interface UpdateReportCommand {
  id: string;
  clinincalInfo?: string;
  indication?: string;
  technique?: string;
  impression?: string;
  recommendation?: string;
  findings?: UpdateFindingCommand[];
  signedAt?: string;
  referringPhysicianId?: string;
}
