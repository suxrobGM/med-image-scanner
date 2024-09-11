"use server"
import {
  Result,
  UpdatePasswordCommand,
  UpdateProfileCommand,
} from "@/core/models";
import {ApiService} from "@/core/services";

export async function updateProfileAction(prevState: Result | null, formData: FormData): Promise<Result> {
  const command: UpdateProfileCommand = {
    userId: formData.get("userId") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    workPhone: formData.get("workPhone") as string,
    mobilePhone: formData.get("mobilePhone") as string,
    country: formData.get("country") as string,
    timezone: formData.get("timezone") as string,
  };
  return ApiService.ins.updateProfile(command);
}

export async function updatePasswordAction(prevState: Result | null, formData: FormData): Promise<Result> {
  const command: UpdatePasswordCommand = {
    userId: formData.get("userId") as string,
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
  };
  return ApiService.ins.updatePassword(command);
}
