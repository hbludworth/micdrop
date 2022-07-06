import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasSubscriptionsTable = await knex.schema.hasTable('subscriptions');

  if (!hasSubscriptionsTable) {
    await knex.schema.createTable('subscriptions', (table) => {
      table.increments('id');
      table.string('subscription_id').notNullable().unique();
      table.string('customer_id').notNullable();
      table.string('payment_method_id');
      table.string('status').notNullable();

      table.foreign('customer_id').references('user.stripe_customer_id');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasSubscriptionsTable = await knex.schema.hasTable('subscriptions');

  if (hasSubscriptionsTable) {
    await knex.schema.dropTable('subscriptions');
  }
}
