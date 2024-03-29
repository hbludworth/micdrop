import knex from '../../../connection';
import { AudioMessage } from 'types';

class AudioDao {
  async createAudio(
    uuid: string,
    userUuid: string,
    fileType: string,
    customPlaybackUuid: string
  ): Promise<void> {
    await knex('audio').insert({
      uuid,
      user_uuid: userUuid,
      created_on: new Date(),
      file_type: fileType,
      custom_playback_uuid: customPlaybackUuid,
    });
  }

  async deleteAudio(uuid: string): Promise<void> {
    await knex('audio').del().where({ uuid });
  }

  async audioBelongsToUser(uuid: string, userUuid: string): Promise<boolean> {
    const row = await knex('audio')
      .where({ uuid, user_uuid: userUuid })
      .first();

    return !!row;
  }

  async audioMessageExists(uuid: string): Promise<boolean> {
    const row = await knex('audio').where({ uuid }).first();
    return !!row;
  }

  async editLabel(uuid: string, label: string): Promise<void> {
    await knex('audio').update({ label }).where({ uuid });
  }

  async getAudioMessagesByGroup(
    groupUuid: string | null,
    userUuid: string
  ): Promise<AudioMessage[]> {
    const rows = await knex('audio')
      .select(
        'uuid',
        'user_uuid as userUuid',
        'created_on as createdOn',
        'file_type as fileType',
        'label',
        'audio_group_uuid as audioGroupUuid',
        'custom_playback_uuid as customPlaybackUuid'
      )
      .where({ user_uuid: userUuid })
      .modify((qb) => {
        if (groupUuid) {
          qb.andWhere({ audio_group_uuid: groupUuid });
        }
      })
      .orderBy('created_on', 'desc');
    return rows;
  }

  async getAudioMessageByUuid(uuid: string): Promise<AudioMessage> {
    const row = await knex('audio')
      .select(
        'uuid',
        'user_uuid as userUuid',
        'created_on as createdOn',
        'file_type as fileType',
        'label',
        'audio_group_uuid as audioGroupUuid',
        'custom_playback_uuid as customPlaybackUuid'
      )
      .where({ uuid })
      .first();
    return row;
  }

  async addGroupToAudio(uuid: string, groupUuid: string | null): Promise<void> {
    await knex('audio').update({ audio_group_uuid: groupUuid }).where({ uuid });
  }

  async removeGroupFromAudio(groupUuid: string): Promise<void> {
    await knex('audio')
      .update({ audio_group_uuid: null })
      .where({ audio_group_uuid: groupUuid });
  }
}

export default new AudioDao();
