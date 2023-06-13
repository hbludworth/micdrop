import axios from '../axiosInstance';
import { AudioMessageWithUrl } from 'types';

async function uploadAudio(
  audioBlob: Blob,
  customPlaybackUuid: string
): Promise<string> {
  const formData = new FormData();
  formData.append('newFile', audioBlob, 'newFile.wav');

  const { data } = await axios.post('/audio', formData, {
    params: {
      customPlaybackUuid,
    },
  });
  return data;
}

async function deleteAudio(uuid: string): Promise<void> {
  await axios.delete(`/audio/${uuid}`);
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
  deleteAudio,
  editLabel,
  getAudioMessage,
  addGroupToAudio,
};
