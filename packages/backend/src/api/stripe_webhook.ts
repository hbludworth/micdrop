import express from 'express';
import stripe from '../stripeInstance';
import { HttpBadRequest } from '../exceptions';
import Stripe from 'stripe';
import sl from '../serviceLocator';
import 'dotenv/config';

const router = express.Router();

router.route('/stripe_webhook').post(async (req, res, next) => {
  const UserDao = sl.get('UserDao');
  const SubscriptionsDao = sl.get('SubscriptionsDao');

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      req.body,
      req.headers['stripe-signature']!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(err);
    next(new HttpBadRequest('Error verifying webhook'));
    return;
  }

  console.log(event.type);

  const dataObject = event.data.object;

  switch (event.type) {
    case 'customer.created':
      const customer = dataObject as Stripe.Customer;

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price:
              process.env.NODE_ENV === 'development'
                ? 'price_1LBVE2BD1AUOs1O8mDk1M12p'
                : 'price_1LIJwgBD1AUOs1O8uQh9u3NW',
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        trial_end: parseInt((Date.now() / 1000).toFixed(0)) + 60 * 60 * 24 * 30, // 30 Day Trial
        cancel_at:
          parseInt((Date.now() / 1000).toFixed(0)) + 60 * 60 * 24 * 30 + 60 * 5, // Cancel in 30 days + 5 minutes
      });

      await SubscriptionsDao.createSubscription(
        subscription.id,
        subscription.customer as string,
        null
      );

      break;

    case 'customer.subscription.created':
      const createdCurrentStatus = (dataObject as Stripe.Subscription).status;
      const createdSubscriptionId = (dataObject as Stripe.Subscription).id;
      if (
        createdCurrentStatus === 'active' ||
        createdCurrentStatus === 'trialing'
      ) {
        const customerId = (dataObject as Stripe.Subscription)
          .customer as string;

        const userUuid = await UserDao.getUserUuidByCustomerId(customerId);

        await UserDao.setSubscriptionLevel(userUuid, 'pro');
      }
      await SubscriptionsDao.updateSubscriptionStatus(
        createdSubscriptionId,
        createdCurrentStatus
      );

      break;

    case 'customer.subscription.updated':
      const currentStatus = (dataObject as Stripe.Subscription).status;
      const subscriptionId = (dataObject as Stripe.Subscription).id;
      if (currentStatus === 'active' || currentStatus === 'trialing') {
        const customerId = (dataObject as Stripe.Subscription)
          .customer as string;

        const userUuid = await UserDao.getUserUuidByCustomerId(customerId);

        await UserDao.setSubscriptionLevel(userUuid, 'pro');
      }
      await SubscriptionsDao.updateSubscriptionStatus(
        subscriptionId,
        currentStatus
      );
      break;

    case 'customer.subscription.deleted':
      const customerId = (dataObject as Stripe.Subscription).customer as string;
      const deletedSubscriptionId = (dataObject as Stripe.Subscription).id;

      const userUuid = await UserDao.getUserUuidByCustomerId(customerId);

      await SubscriptionsDao.deleteSubscription(deletedSubscriptionId);
      await UserDao.setSubscriptionLevel(userUuid, 'free');
      break;

    case 'customer.subscription.trial_will_end':
      const endingSubscriptionId = (dataObject as Stripe.Subscription).id;
      await SubscriptionsDao.updateSubscriptionStatus(
        endingSubscriptionId,
        'trial_will_end'
      );
      break;

    case 'payment_method.attached':
      const paymentMethod = dataObject as Stripe.PaymentMethod;

      const paymentMethodId = paymentMethod.id;
      const paymentMethodCustomerId = paymentMethod.customer as string;

      await SubscriptionsDao.setPaymentMethodId(
        paymentMethodId,
        paymentMethodCustomerId
      );

      await stripe.customers.update(paymentMethodCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      break;

    default:
      break;
  }

  res.sendStatus(200);
});

export default router;
