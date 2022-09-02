import axios from '../axiosInstance';
import {
  CreateNewCustomPlaybackPayload,
  CustomPlaybackDisplay,
  CustomPlaybackRow,
} from 'types';

async function getCustomPlaybackOptions(): Promise<CustomPlaybackDisplay[]> {
  const { data } = await axios.get('/custom_playback_options');
  return data;
}

async function createCustomPlayback(
  payload: CreateNewCustomPlaybackPayload
): Promise<CustomPlaybackRow> {
  const { data } = await axios.post('/custom_playback', payload);
  return data;
}

export default {
  getCustomPlaybackOptions,
  createCustomPlayback,
};
