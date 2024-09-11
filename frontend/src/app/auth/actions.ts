"use server";
//@ts-ignore
import {AuthError} from "next-auth";
import {redirect} from "next/navigation";
import {signIn, signOut} from "@/auth";
import {RegisterUserCommand, Result} from "@/core/models";
import {ApiService} from "@/core/services";

/**
 * Server action to sign in a user from a form.
 * @param prevState Previous state of the form.
 * @param data Form data.
 * @returns New state of the form.
 */
export async function signInUserAction(prevState: Result | null, data: FormData): Promise<Result> {
  try {
    await signIn("credentials", {
      username: data.get("email"),
      password: data.get("password"),
      redirectTo: "/",
    });

    return {success: true};
  }
  catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Failed to sign in, email or password is incorrect."
      };
    }
    
    throw error;
  }
}

/**
 * Server action to sign out a user.
 */
export async function signOutUserAction(): Promise<void> {
  await signOut({redirectTo: "/auth/signin"});
}

/**
 * Server action to register a user.
 * @param command Command to register a user.
 * @returns Result of the registration.
 */
export async function registerUserAction(command: RegisterUserCommand): Promise<Result> {
  return ApiService.ins.registerUser(command);
}

export async function resetPasswordAction(prevState: Result | null, data: FormData): Promise<Result> {
  const token = data.get("token") as string;
  const password = data.get("password") as string;
  const result = await ApiService.ins.resetPassword({token, password});

  if (result.success) {
    redirect("/auth/signin");
  }

  return result;
}

export async function requestPasswordRecoveryAction(prevState: Result | null, data: FormData): Promise<Result> {
  const email = data.get("email") as string;
  return ApiService.ins.requestPasswordRecovery({email});
}

export async function joinOrganizationAction(prevState: Result | null, data: FormData): Promise<Result> {
  const token = data.get("token") as string;
  
  const result = await ApiService.ins.joinOrganization({token});

  if (result.success) {
    redirect("/auth/signin");
  }

  return result;
}
