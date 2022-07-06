import { LoginPayload } from 'types';
import firebase from '../firebase';

async function login(payload: LoginPayload): Promise<void> {
  await firebase
    .auth()
    .signInWithEmailAndPassword(payload.email, payload.password);
}

export default {
  login,
};
