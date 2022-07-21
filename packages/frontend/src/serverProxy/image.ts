import { CreateNewCustomPlaybackImagePayload } from 'types';
import axios from '../axiosInstance';

async function getImage(key: string): Promise<string> {
  const { data } = await axios.get(`/image/${key}`);

  const response = await fetch(data);

  if (!response.ok) {
    throw new Error('The image file does not exist');
  }
  return data;
}

const uploadImage = async (
  image: CreateNewCustomPlaybackImagePayload
): Promise<void> => {
  const file = image.file;
  if (file) {
    const formData = new FormData();
    formData.append('newFile', file, 'newFile');

    await axios.post(`/image/upload/${image.name}`, formData);
  }
};

export default {
  getImage,
  uploadImage,
};
