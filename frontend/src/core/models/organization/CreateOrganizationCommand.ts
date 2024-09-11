export interface CreateOrganizationCommand {
  name: string;
  displayName?: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
  dicomUrl: string;
}
