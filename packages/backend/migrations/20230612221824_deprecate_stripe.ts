import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasSubscriptionsTable = await knex.schema.hasTable('subscriptions');
  if (hasSubscriptionsTable) {
    await knex.schema.dropTable('subscriptions');
  }

  const hasAdminColumn = await knex.schema.hasColumn('user', 'is_admin');
  if (hasAdminColumn) {
    await knex.schema.table('user', (table) => {
      table.dropColumn('is_admin');
    });
  }

  const hasSubscriptionLevelColumn = await knex.schema.hasColumn(
    'user',
    'subscription_level'
  );
  if (hasSubscriptionLevelColumn) {
    await knex.schema.table('user', (table) => {
      table.dropColumn('subscription_level');
    });
  }

  const hasStripeCustomerIdColumn = await knex.schema.hasColumn(
    'user',
    'stripe_customer_id'
  );
  if (hasStripeCustomerIdColumn) {
    await knex.schema.table('user', (table) => {
      table.dropColumn('stripe_customer_id');
    });
  }
}

export async function down(_knex: Knex): Promise<void> {
  // No down migration
}
