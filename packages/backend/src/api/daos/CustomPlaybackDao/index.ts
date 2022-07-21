import knex from '../../../connection';
import { CustomPlaybackRow } from 'types';

class CustomPlaybackDao {
  async getCustomPlaybackByUuid(uuid: string): Promise<CustomPlaybackRow> {
    const row: CustomPlaybackRow = await knex('custom_playback')
      .select(
        'uuid',
        'user_uuid as userUuid',
        'name',
        'background_color as backgroundColor',
        'play_button_color as playButtonColor',
        'pause_button_color as pauseButtonColor',
        'play_pause_icon_color as playPauseIconColor',
        'time_background_color as timeBackgroundColor',
        'time_font_color as timeFontColor',
        'scrubber_color as scrubberColor',
        'circle_img as circleImage',
        'signature_text as signatureText',
        'signature_img as signatureImage',
        'link'
      )
      .where({ uuid })
      .first();
    return row;
  }

  async getCustomPlaybackOptionsByUserUuid(
    userUuid: string | null
  ): Promise<CustomPlaybackRow[]> {
    const rows: CustomPlaybackRow[] = await knex('custom_playback')
      .select(
        'uuid',
        'user_uuid as userUuid',
        'name',
        'background_color as backgroundColor',
        'play_button_color as playButtonColor',
        'pause_button_color as pauseButtonColor',
        'play_pause_icon_color as playPauseIconColor',
        'time_background_color as timeBackgroundColor',
        'time_font_color as timeFontColor',
        'scrubber_color as scrubberColor',
        'circle_img as circleImage',
        'signature_text as signatureText',
        'signature_img as signatureImage',
        'link'
      )
      .modify((qb) => {
        if (userUuid) {
          qb.where({ user_uuid: userUuid });
        } else {
          qb.whereNull('user_uuid');
        }
      });
    return rows;
  }

  async createCustomPlayback(row: CustomPlaybackRow): Promise<void> {
    await knex('custom_playback').insert({
      uuid: row.uuid,
      user_uuid: row.userUuid,
      name: row.name,
      background_color: row.backgroundColor,
      play_button_color: row.playButtonColor,
      pause_button_color: row.pauseButtonColor,
      play_pause_icon_color: row.playPauseIconColor,
      time_background_color: row.timeBackgroundColor,
      time_font_color: row.timeFontColor,
      scrubber_color: row.scrubberColor,
      circle_img: row.circleImage,
      signature_text: row.signatureText,
      signature_img: row.signatureImage,
      link: row.link,
    });
  }
}

export default new CustomPlaybackDao();
