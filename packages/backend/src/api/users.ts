import express from 'express';
import authenticatedRoute from '../middlewares/authenticatedRoute';
import {
  HttpInternalError,
  HttpBadRequest,
  HttpForbidden,
} from '../exceptions';
import sl from '../serviceLocator';
import stripe from '../stripeInstance';
import {
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  PaymentMethodResponse,
} from 'types';
import freeRoute from '../middlewares/freeRoute';
import proRoute from '../middlewares/proRoute';

const router = express.Router();

router.route('/users/:uuid').get(authenticatedRoute, async (req, res, next) => {
  try {
    const UserDao = sl.get('UserDao');
    const { uuid } = req.params;

    const userExists = await UserDao.uuidExists(uuid);
    if (!userExists) {
      next(new HttpBadRequest(`There is no user with UUID ${uuid}`));
      return;
    }

    const user = await UserDao.getUserByUuid(uuid);

    if (req.user!.uuid !== uuid) {
      next(
        new HttpForbidden(
          `You do not have permission to retrieve information for user with UUID ${uuid}`
        )
      );
      return;
    }

    res.json(user);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router
  .route('/users/create_subscription')
  .post(freeRoute, async (req, res, next) => {
    const SubscriptionsDao = sl.get('SubscriptionsDao');

    const { customerId, priceId }: CreateSubscriptionPayload = req.body;

    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 14,
        // trial_end: parseInt((Date.now() / 1000).toFixed(0)) + 60 * 2, // TESTING - 2 minute trial
      });

      await SubscriptionsDao.createSubscription(
        subscription.id,
        subscription.customer as string,
        null
      );

      if (subscription.pending_setup_intent) {
        const setupIntent = await stripe.setupIntents.retrieve(
          subscription.pending_setup_intent as string
        );
        const response: CreateSubscriptionResponse = {
          subscriptionId: subscription.id,
          clientSecret: setupIntent.client_secret,
        };
        res.json(response);
        return;
      }

      const response: CreateSubscriptionResponse = {
        subscriptionId: subscription.id,
        clientSecret: null,
      };
      res.json(response);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/users/cancel_subscription')
  .delete(proRoute, async (req, res, next) => {
    const SubscriptionsDao = sl.get('SubscriptionsDao');
    const UserDao = sl.get('UserDao');

    const userUuid = req.user!.uuid;

    try {
      const customerId = (await UserDao.getUserByUuid(userUuid))
        .stripeCustomerId;
      const subscriptionId =
        await SubscriptionsDao.getSubscriptionIdByCustomerId(customerId);

      const canceledSubscription = await stripe.subscriptions.update(
        subscriptionId,
        { cancel_at_period_end: true }
      );

      res.json(canceledSubscription.status);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/customers/payment_method')
  .get(authenticatedRoute, async (req, res, next) => {
    const SubscriptionsDao = sl.get('SubscriptionsDao');
    const UserDao = sl.get('UserDao');

    const userUuid = req.user!.uuid;
    try {
      const customerId = (await UserDao.getUserByUuid(userUuid))
        .stripeCustomerId;

      const paymentMethodId =
        await SubscriptionsDao.getPaymendMethodIdByCustomerId(customerId);

      if (!paymentMethodId) {
        res.json({
          brand: null,
          last4: null,
        } as PaymentMethodResponse);
        return;
      }

      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );

      const response: PaymentMethodResponse = {
        brand: paymentMethod.card!.brand,
        last4: paymentMethod.card!.last4,
      };
      res.json(response);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/customers/subscription_status')
  .get(authenticatedRoute, async (req, res, next) => {
    const SubscriptionsDao = sl.get('SubscriptionsDao');
    const UserDao = sl.get('UserDao');

    const userUuid = req.user!.uuid;
    try {
      const customerId = (await UserDao.getUserByUuid(userUuid))
        .stripeCustomerId;

      const subscriptionStatus =
        await SubscriptionsDao.getSubscriptionStatusByCustomerId(customerId);

      res.json(subscriptionStatus);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
