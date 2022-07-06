import axios from '../axiosInstance';
import { AudioLimits, AudioMessageWithUrl } from 'types';

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

async function editLabel(uuid: string, label: string): Promise<void> {
  await axios.patch(`/audio_label/${uuid}`, {
    label,
  });
}

async function getAudioMessage(uuid: string): Promise<AudioMessageWithUrl> {
  const { data } = await axios.get(`/audio_message/${uuid}`);
  return data;
}

async function addGroupToAudio(
  uuid: string,
  groupUuid: string | null
): Promise<void> {
  await axios.patch(`/audio/${uuid}/${groupUuid}`);
}

export default {
  uploadAudio,
  getAudio,
  deleteAudio,
  getMonthlyMessagesLeft,
  editLabel,
  getAudioMessage,
  addGroupToAudio,
};
