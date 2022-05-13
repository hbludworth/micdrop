import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasUserTable = await knex.schema.hasTable('user');

  if (!hasUserTable) {
    await knex.schema.createTable('user', (table) => {
      table.increments('id');
      table.uuid('uuid');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.boolean('is_admin');
      table.string('subscription_level');
      table.dateTime('created_on');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user');
}
