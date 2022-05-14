import axios from '../axiosInstance';

async function getImage(key: string): Promise<string> {
  const { data } = await axios.get(`/image/${key}`);

  const response = await fetch(data);

  if (!response.ok) {
    throw new Error('The image file does not exist');
  }
  return data;
}

export default {
  getImage,
};
