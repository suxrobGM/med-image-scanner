export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobilePhone?: string;
  workPhone?: string;
  role?: string;
  country?: string;
  timezone?: string;
  organization?: string;
}
