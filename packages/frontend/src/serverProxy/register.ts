import axios from '../axiosInstance';
import {
  RegisterPayload,
  RegisterResponse,
  RegisterWithGooglePayload,
  User,
} from 'types';
import firebase from '../firebase';

async function register(payload: RegisterPayload): Promise<User> {
  const { data }: { data: RegisterResponse } = await axios.post(
    '/register',
    payload
  );
  await firebase.auth().signInWithCustomToken(data.firebaseToken);
  return data.user;
}

async function registerWithGoogle(
  payload: RegisterWithGooglePayload
): Promise<void> {
  await axios.post('/register_with_google', payload);
}

export default { register, registerWithGoogle };
