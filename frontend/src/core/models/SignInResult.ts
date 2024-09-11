import {UserDto} from "./user/UserDto";

export interface SignInResult {
  access_token: string;
  token_type: string;
  user: UserDto;
}
