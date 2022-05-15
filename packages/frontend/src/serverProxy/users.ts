import { User } from 'types';
import axios from '../axiosInstance';

async function getUser(uuid: string): Promise<User> {
  const { data } = await axios.get(`/users/${uuid}`);
  return data;
}

export default {
  getUser,
};
