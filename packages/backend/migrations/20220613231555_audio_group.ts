import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasAudioGroupsTable = await knex.schema.hasTable('audio_groups');
  if (!hasAudioGroupsTable) {
    await knex.schema.createTable('audio_groups', (table) => {
      table.increments('id');
      table.uuid('uuid').notNullable().unique();
      table.uuid('user_uuid').notNullable();
      table.string('name');

      table.foreign('user_uuid').references('user.uuid');
    });
  }

  const audioHasGroupColumn = await knex.schema.hasColumn(
    'audio',
    'audio_group_uuid'
  );
  if (!audioHasGroupColumn) {
    await knex.schema.table('audio', (table) => {
      table.uuid('audio_group_uuid').nullable();

      table.foreign('audio_group_uuid').references('audio_groups.uuid');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const audioHasGroupColumn = await knex.schema.hasColumn(
    'audio',
    'audio_group_uuid'
  );
  if (audioHasGroupColumn) {
    await knex.schema.table('audio', (table) => {
      table.dropColumn('audio_group_uuid');
    });
  }

  await knex.schema.dropTableIfExists('audio_groups');
}
