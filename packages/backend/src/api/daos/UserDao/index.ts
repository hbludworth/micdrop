import { User } from 'types';
import knex from '../../../connection';

class UserDao {
  async getUserByUuid(uuid: string): Promise<User> {
    const row: User = await knex('user').select(
      'uuid',
      'first_name as firstName',
      'last_name as lastName',
      'email',
      'is_admin as isAdmin',
      'subscription_level as subscriptionLevel'
    );
    if (!row) {
      throw new Error(`User with UUID ${uuid} does not exist`);
    }

    return row;
  }
}

export default new UserDao();
