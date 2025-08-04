"use server";

import {redirect} from "next/navigation";
import {
  CreateOrganizationCommand,
  Result,
  UpdateOrganizationCommand,
  UserRoleType,
} from "@/core/models";
import {ApiService} from "@/core/services";

export async function updateOrganizationAction(
  prevState: Result | null,
  data: FormData
): Promise<Result> {
  const id = data.get("id")!.toString();
  const name = data.get("name")?.toString();
  const displayName = data.get("displayName")?.toString();
  const dicomUrl = data.get("dicomUrl")?.toString();
  const website = data.get("website")?.toString();
  const email = data.get("email")?.toString();
  const address = data.get("address")?.toString();

  const command: UpdateOrganizationCommand = {
    id,
    name,
    displayName,
    dicomUrl,
    website,
    email,
    address,
  };

  return ApiService.ins.updateOrganization(command);
}

export async function createOrganizationAction(
  prevState: Result | null,
  data: FormData
): Promise<Result> {
  const name = data.get("name")!.toString();
  const displayName = data.get("displayName")?.toString();
  const dicomUrl = data.get("dicomUrl")!.toString();
  const website = data.get("website")?.toString();
  const email = data.get("email")?.toString();
  const address = data.get("address")?.toString();

  const command: CreateOrganizationCommand = {
    name,
    displayName,
    dicomUrl,
    website,
    email,
    address,
  };

  const result = await ApiService.ins.createOrganization(command);

  if (result.success) {
    redirect("/admin/organizations");
  }

  return result;
}

/**
 * Server action to send an invitation to a user.
 * @param data Form data.
 */
export async function inviteUserAction(prevState: Result | null, data: FormData): Promise<Result> {
  const email = data.get("email")!.toString();
  const role = data.get("role")!.toString();
  const organization = data.get("organization")!.toString();
  return ApiService.ins.inviteUser({email, role, organization});
}

export async function addOrganizationAdminAction(
  prevState: Result | null,
  data: FormData
): Promise<Result> {
  const userId = data.get("userId")!.toString();
  const organization = data.get("organizationName")!.toString();
  return ApiService.ins.updateUserRole({
    userId,
    organization,
    role: UserRoleType.ORG_ADMIN,
  });
}

export async function updateUserRoleAction(
  prevState: Result | null,
  data: FormData
): Promise<Result> {
  const userId = data.get("userId")!.toString();
  const role = data.get("role")!.toString();
  const organization = data.get("organization")?.toString();

  return ApiService.ins.updateUserRole({
    userId,
    role,
    organization,
  });
}

export async function updateUserOrgAction(
  prevState: Result | null,
  data: FormData
): Promise<Result> {
  const userId = data.get("userId")!.toString();
  const organization = data.get("organization")!.toString();
  return ApiService.ins.updateUserOrganization({userId, organization});
}
