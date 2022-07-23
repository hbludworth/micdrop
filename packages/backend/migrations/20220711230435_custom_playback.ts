import { Knex } from 'knex';
import { v4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  const micdropCustomPlaybackUuid = '7c4b7c5a-3b59-43ae-959b-f019cbe04a82';
  const classicCustomPlaybackUuid = 'f5388ffc-2358-4f05-b2ac-4626df5ea9d9';

  const hasCustomPlaybackTable = await knex.schema.hasTable('custom_playback');

  if (!hasCustomPlaybackTable) {
    await knex.schema.createTable('custom_playback', (table) => {
      table.increments('id');
      table.uuid('uuid').notNullable().unique();
      table.uuid('user_uuid').nullable();
      table.string('name').notNullable();
      table.string('background_color', 7).notNullable();
      table.string('play_button_color', 7).notNullable();
      table.string('pause_button_color', 7).notNullable();
      table.string('play_pause_icon_color', 7).notNullable();
      table.string('time_background_color', 7).notNullable();
      table.string('time_font_color', 7).notNullable();
      table.string('scrubber_color', 7).notNullable();
      table.string('circle_img').nullable();
      table.string('signature_text').notNullable();
      table.string('signature_img').nullable();
      table.string('link').notNullable();

      table.foreign('user_uuid').references('user.uuid');
    });

    await knex('custom_playback').insert([
      {
        uuid: micdropCustomPlaybackUuid,
        user_uuid: null,
        name: 'MicDrop',
        background_color: '#3a79d9',
        play_button_color: '#ffffff',
        pause_button_color: '#ffffff',
        play_pause_icon_color: '#3a79d9',
        time_background_color: '#ffffff',
        time_font_color: '#3a79d9',
        scrubber_color: '#3a79d9',
        circle_img: 'micdrop_circle.png',
        signature_text: 'Powered By',
        signature_img: 'micdrop_signature.png',
        link: 'https://sendmicdrop.com',
      },
      {
        uuid: classicCustomPlaybackUuid,
        user_uuid: null,
        name: 'Classic',
        background_color: '#9cc8f4',
        play_button_color: '#3a79d9',
        pause_button_color: '#ea4235',
        play_pause_icon_color: '#ffffff',
        time_background_color: '#34a853',
        time_font_color: '#ffffff',
        scrubber_color: '#d84f3f',
        circle_img: null,
        signature_text: 'Powered By',
        signature_img: 'micdrop_signature.png',
        link: 'https://sendmicdrop.com',
      },
    ]);
  }

  const audioTableHasPlaybackUuid = await knex.schema.hasColumn(
    'audio',
    'custom_playback_uuid'
  );

  if (!audioTableHasPlaybackUuid) {
    await knex.schema.table('audio', (table) => {
      table.uuid('custom_playback_uuid').notNullable();
    });

    await knex('audio').update({
      custom_playback_uuid: micdropCustomPlaybackUuid,
    });

    await knex.schema.alterTable('audio', (table) => {
      table.foreign('custom_playback_uuid').references('custom_playback.uuid');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const audioTableHasPlaybackUuid = await knex.schema.hasColumn(
    'audio',
    'custom_playback_uuid'
  );

  if (audioTableHasPlaybackUuid) {
    await knex.schema.table('audio', (table) => {
      table.dropForeign('custom_playback_uuid');

      table.dropColumn('custom_playback_uuid');
    });
  }

  await knex.schema.dropTableIfExists('custom_playback');
}
