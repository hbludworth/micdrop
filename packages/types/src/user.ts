export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}
