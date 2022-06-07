import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasAudioTable = await knex.schema.hasTable('audio');

  if (!hasAudioTable) {
    await knex.schema.createTable('audio', (table) => {
      table.increments('id');
      table.uuid('uuid').notNullable().unique();
      table.uuid('user_uuid');
      table.dateTime('created_on');
      table.string('file_type', 3);

      table.foreign('user_uuid').references('user.uuid');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audio');
}
