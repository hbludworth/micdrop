import {
  User,
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  PaymentMethodResponse,
  SubscriptionStatus,
} from 'types';
import axios from '../axiosInstance';

async function getUser(uuid: string): Promise<User> {
  const { data } = await axios.get(`/users/${uuid}`);
  return data;
}

async function createProSubscription(
  customerId: string
): Promise<CreateSubscriptionResponse> {
  const PRO_PRICE_ID = 'price_1LBVE2BD1AUOs1O8mDk1M12p';

  const payload: CreateSubscriptionPayload = {
    priceId: PRO_PRICE_ID,
    customerId,
  };
  const { data } = await axios.post('/users/create_subscription', payload);
  return data;
}

async function cancelSubscription(): Promise<string> {
  const { data } = await axios.delete('/users/cancel_subscription');
  return data;
}

async function getPaymentMethod(): Promise<PaymentMethodResponse> {
  const { data } = await axios.get('/customers/payment_method');
  return data;
}

async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { data } = await axios.get('/customers/subscription_status');
  return data;
}

export default {
  getUser,
  createProSubscription,
  cancelSubscription,
  getPaymentMethod,
  getSubscriptionStatus,
};
