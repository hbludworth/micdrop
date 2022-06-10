import axios from '../axiosInstance';
import { AudioLimits } from 'types';

async function uploadAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('newFile', audioBlob, 'newFile.wav');

  const { data } = await axios.post('/audio', formData);
  return data;
}

async function getAudio(uuid: string): Promise<string> {
  const { data } = await axios.get(`/audio/${uuid}`);

  const response = await fetch(data);

  if (!response.ok) {
    throw new Error('The audio file does not exist');
  }
  return data;
}

async function deleteAudio(uuid: string): Promise<void> {
  await axios.delete(`/audio/${uuid}`);
}

async function getMonthlyMessagesLeft(): Promise<AudioLimits> {
  const { data } = await axios.get('/audio_limit');
  return data;
}

export default {
  uploadAudio,
  getAudio,
  deleteAudio,
  getMonthlyMessagesLeft,
};
