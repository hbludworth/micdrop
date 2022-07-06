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
