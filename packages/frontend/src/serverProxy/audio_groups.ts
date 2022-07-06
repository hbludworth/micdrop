import axios from '../axiosInstance';
import { AudioGroup, AudioMessage } from 'types';

async function getUserAudioGroups(): Promise<AudioGroup[]> {
  const { data } = await axios.get('/audio_groups');
  return data;
}

async function createAudioGroup(name: string): Promise<void> {
  await axios.post('/audio_groups', {
    name,
  });
}

async function getGroupAudioMessages(
  groupUuid: string | null
): Promise<AudioMessage[]> {
  const { data } = await axios.get(`/audio_groups/${groupUuid}`);
  return data;
}

async function deleteAudioGroup(groupUuid: string): Promise<void> {
  await axios.delete(`/audio_groups/${groupUuid}`);
}

async function renameAudioGroup(
  groupUuid: string,
  newName: string
): Promise<void> {
  await axios.patch(`/audio_groups/${groupUuid}`, {
    name: newName,
  });
}

export default {
  getUserAudioGroups,
  createAudioGroup,
  getGroupAudioMessages,
  deleteAudioGroup,
  renameAudioGroup,
};
