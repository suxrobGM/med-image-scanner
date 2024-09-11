export interface InviteToOrgCommand {
  email: string;
  role: string | null;
  organization: string;
}
