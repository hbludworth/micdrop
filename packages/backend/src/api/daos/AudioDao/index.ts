import knex from '../../../connection';

class AudioDao {
  async createAudio(
    uuid: string,
    userUuid: string,
    fileType: string
  ): Promise<void> {
    await knex('audio').insert({
      uuid,
      user_uuid: userUuid,
      created_on: new Date(),
      file_type: fileType,
    });
  }

  async deleteAudio(uuid: string): Promise<void> {
    await knex('audio').del().where({ uuid });
  }

  async audioBelongsToUser(uuid: string, userUuid: string): Promise<boolean> {
    const row = await knex('audio')
      .where({ uuid })
      .andWhere('user_uuid', userUuid)
      .first();

    return !!row;
  }
}

export default new AudioDao();
