import { User, UpdateProfilePayload } from 'types';
import knex from '../../../connection';

class UserDao {
  async getUserByUuid(uuid: string): Promise<User> {
    const row: User = await knex('user')
      .select(
        'uuid',
        'first_name as firstName',
        'last_name as lastName',
        'email'
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
    email: string
  ): Promise<void> {
    await knex('user').insert({
      uuid,
      first_name: firstName,
      last_name: lastName,
      email,
      created_on: new Date(),
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
}

export default new UserDao();
