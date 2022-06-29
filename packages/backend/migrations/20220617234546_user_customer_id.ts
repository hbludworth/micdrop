import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasCustomerIdColumn = await knex.schema.hasColumn(
    'user',
    'stripe_customer_id'
  );

  if (!hasCustomerIdColumn) {
    await knex.schema.table('user', (table) => {
      table.string('stripe_customer_id').notNullable().unique();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasCustomerIdColumn = await knex.schema.hasColumn(
    'user',
    'stripe_customer_id'
  );

  if (hasCustomerIdColumn) {
    await knex.schema.table('user', (table) => {
      table.dropColumn('stripe_customer_id');
    });
  }
}
