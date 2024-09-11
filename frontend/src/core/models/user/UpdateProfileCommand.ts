export interface UpdateProfileCommand {
  userId: string;
  firstName?: string;
  lastName?: string;
  workPhone?: string | null;
  mobilePhone?: string | null;
  country?: string | null;
  timezone?: string | null;
}
