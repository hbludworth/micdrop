import knex from '../../../connection';
import { v4 } from 'uuid';
import { AudioGroup } from 'types';

class AudioGroupsDao {
  async getUserAudioGroups(userUuid: string): Promise<AudioGroup[]> {
    const rows = await knex('audio_groups')
      .select('uuid', 'name')
      .where({ user_uuid: userUuid });

    return rows;
  }

  async createAudioGroup(userUuid: string, name: string): Promise<void> {
    await knex('audio_groups').insert({
      uuid: v4(),
      user_uuid: userUuid,
      name,
    });
  }

  async audioGroupBelongsToUser(
    uuid: string,
    userUuid: string
  ): Promise<boolean> {
    const row = await knex('audio_groups')
      .where({ uuid, user_uuid: userUuid })
      .first();

    return !!row;
  }

  async audioGroupExists(uuid: string): Promise<boolean> {
    const row = await knex('audio_groups').where({ uuid }).first();

    return !!row;
  }

  async deleteGroup(uuid: string): Promise<void> {
    await knex('audio_groups').del().where({ uuid });
  }

  async renameGroup(uuid: string, name: string): Promise<void> {
    await knex('audio_groups').update({ name }).where({ uuid });
  }
}

export default new AudioGroupsDao();
