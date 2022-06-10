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

  async getMonthlyMessagesLeft(userUuid: string): Promise<number> {
    const MONTHLY_LIMIT = 30;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const countRow = await knex('audio')
      .count({ count: 'uuid' })
      .where({ user_uuid: userUuid })
      .andWhereRaw('MONTH(created_on) = ?', [currentMonth + 1])
      .andWhereRaw('YEAR(created_on) = ?', [currentYear])
      .first();

    const currentNumberOfMessages =
      countRow && countRow.count ? (countRow.count as number) : 0;

    const rawNumberLeft = MONTHLY_LIMIT - currentNumberOfMessages;
    return rawNumberLeft >= 0 ? rawNumberLeft : 0;
  }
}

export default new AudioDao();
