export interface UpdateUserRoleCommand {
  userId: string;
  role: string | null;
  organization?: string;
}
