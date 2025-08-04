"use server";

import {Result, UpdateReportCommand} from "@/core/models";
import {ApiService} from "@/core/services";

export async function updateReportAction(command: UpdateReportCommand): Promise<Result> {
  return ApiService.ins.updateReport(command);
}
