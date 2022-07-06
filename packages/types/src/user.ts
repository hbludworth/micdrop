export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  subscriptionLevel: SubscriptionLevel;
  stripeCustomerId: string;
}

export type SubscriptionLevel = 'free' | 'pro';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CreateSubscriptionPayload {
  priceId: string;
  customerId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret: string | null;
}

export interface PaymentMethodResponse {
  brand: string | null;
  last4: string | null;
}
