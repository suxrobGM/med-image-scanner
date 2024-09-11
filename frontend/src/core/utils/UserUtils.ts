//@ts-ignore
import {User} from "next-auth";
import {Gender, UserDto, UserRoleType} from "../models";

export class UserUtils {
  private constructor() {}

  /**
   * Check if the user is an app admin. App admin can be an app admin or a super admin.
   * @param role User role
   * @returns True if the user is an app admin
   */
  static isAppAdmin(role?: string | null): boolean {
    return role === UserRoleType.APP_ADMIN || role === UserRoleType.SUPER_ADMIN;
  }

  /**
   * Get the initials from the user's full name.
   * @param name Name to get the initials from
   * @returns Initials of the name
   */
  static getInitials(user?: UserDto | User | null): string {
    if (!user) {
      return "";
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }

  /**
   * Get gender translation
   * @param gender User's gender
   * @param t Translation function
   * @returns Translated gender
   */
  static getGender(gender: string, t: (key: string) => string): string {
    switch (gender) {
      case Gender.MALE:
        return t("common.gender.male");
      case Gender.FEMALE:
        return t("common.gender.female");
      default:
        return t("common.gender.male");
    }
  }
}
