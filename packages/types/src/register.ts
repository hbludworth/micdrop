import { User } from './user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
}

export interface RegisterWithGooglePayload {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  user: User;
  firebaseToken: string;
}
