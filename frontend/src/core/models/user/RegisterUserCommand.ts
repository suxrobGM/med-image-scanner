export interface RegisterUserCommand {
  token: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  country?: string;
  timezone?: string;
  gender?: string;
  password: string;
  mobileNumber?: string;
  workNumber?: string;
}
