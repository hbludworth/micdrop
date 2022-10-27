import { LoginPayload } from 'types';
import firebase from '../firebase';

async function login(payload: LoginPayload): Promise<void> {
  await firebase
    .auth()
    .signInWithEmailAndPassword(payload.email, payload.password);
}

async function loginWithGoogle(): Promise<void> {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithPopup(provider);
}

export default {
  login,
  loginWithGoogle,
};
