import knex from '../../../connection';
import { SubscriptionStatus } from 'types';

class SubscriptionsDao {
  async createSubscription(
    subscriptionId: string,
    customerId: string,
    paymentMethodId: string | null
  ): Promise<void> {
    await knex('subscriptions').insert({
      subscription_id: subscriptionId,
      customer_id: customerId,
      payment_method_id: paymentMethodId,
      status: 'incomplete',
    });
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    await knex('subscriptions')
      .where({ subscription_id: subscriptionId })
      .del();
  }

  async getSubscriptionIdByCustomerId(customerId: string): Promise<string> {
    const row = await knex('subscriptions')
      .select('subscription_id as subscriptionId')
      .where({ customer_id: customerId })
      .first();
    return row.subscriptionId;
  }

  async setPaymentMethodId(
    paymentMethodId: string,
    customerId: string
  ): Promise<void> {
    await knex('subscriptions')
      .where({ customer_id: customerId })
      .update({ payment_method_id: paymentMethodId });
  }

  async getPaymendMethodIdByCustomerId(
    customerId: string
  ): Promise<string | null> {
    const row = await knex('subscriptions')
      .select('payment_method_id as paymentMethodId')
      .where({ customer_id: customerId })
      .first();
    return row ? row.paymentMethodId : null;
  }

  async getSubscriptionStatusByCustomerId(
    customerId: string
  ): Promise<SubscriptionStatus> {
    const row = await knex('subscriptions')
      .select('status')
      .where({ customer_id: customerId })
      .first();
    return row.status;
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    status: SubscriptionStatus
  ): Promise<void> {
    await knex('subscriptions')
      .where({ subscription_id: subscriptionId })
      .update({ status });
  }
}

export default new SubscriptionsDao();
