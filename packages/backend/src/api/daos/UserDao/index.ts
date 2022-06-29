import { SubscriptionLevel, User, UpdateProfilePayload } from 'types';
import knex from '../../../connection';

class UserDao {
  async getUserByUuid(uuid: string): Promise<User> {
    const row: User = await knex('user')
      .select(
        'uuid',
        'first_name as firstName',
        'last_name as lastName',
        'email',
        'is_admin as isAdmin',
        'subscription_level as subscriptionLevel',
        'stripe_customer_id as stripeCustomerId'
      )
      .first()
      .where({ uuid });
    if (!row) {
      throw new Error(`User with UUID ${uuid} does not exist`);
    }

    return row;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await knex('user').first().where({ email });
    return !!user;
  }

  async createUser(
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    stripeCustomerId: string
  ): Promise<void> {
    const subscriptionLevel: SubscriptionLevel = 'free';
    await knex('user').insert({
      uuid,
      first_name: firstName,
      last_name: lastName,
      email,
      is_admin: false,
      subscription_level: subscriptionLevel,
      created_on: new Date(),
      stripe_customer_id: stripeCustomerId,
    });
  }

  async uuidExists(uuid: string): Promise<boolean> {
    const user = await knex('user').first().where({ uuid });
    return !!user;
  }

  async updateProfile(
    userUuid: string,
    { email, firstName, lastName }: Required<UpdateProfilePayload>
  ): Promise<void> {
    await knex('user')
      .update({
        email,
        first_name: firstName,
        last_name: lastName,
      })
      .where('uuid', userUuid);
  }

  async setSubscriptionLevel(
    userUuid: string,
    subscriptionLevel: SubscriptionLevel
  ): Promise<void> {
    await knex('user')
      .update({ subscription_level: subscriptionLevel })
      .where({ uuid: userUuid });
  }

  async getUserUuidByCustomerId(customerId: string): Promise<string> {
    const row = await knex('user')
      .select('uuid')
      .where({ stripe_customer_id: customerId })
      .first();
    return row.uuid;
  }
}

export default new UserDao();
