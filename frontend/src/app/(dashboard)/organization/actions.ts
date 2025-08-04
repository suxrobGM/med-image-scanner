"use server";

import {InviteToOrgCommand, Result} from "@/core/models";
import {ApiService} from "@/core/services";

export async function inviteToOrgAction(prevState: Result | null, data: FormData): Promise<Result> {
  const email = data.get("email")!.toString();
  const role = data.get("role")?.toString() ?? null;
  const organization = data.get("organization")!.toString();

  const command: InviteToOrgCommand = {
    email,
    role,
    organization,
  };

  return ApiService.ins.inviteToOrg(command);
}
