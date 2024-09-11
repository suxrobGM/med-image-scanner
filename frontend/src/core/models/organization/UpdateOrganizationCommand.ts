export interface UpdateOrganizationCommand {
  id: string;
  name?: string;
  displayName?: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
  dicomUrl?: string;
}
