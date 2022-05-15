export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  subscriptionLevel: SubscriptionLevel;
}

export type SubscriptionLevel = 'free';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}
