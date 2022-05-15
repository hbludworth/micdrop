import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB0JgCdgFuVdEWR0q3OjHE2REFPZbLYU00',
  authDomain: 'micdrop-auth.firebaseapp.com',
  projectId: 'micdrop-auth',
  storageBucket: 'micdrop-auth.appspot.com',
  messagingSenderId: '829354936788',
  appId: '1:829354936788:web:c04e8dd1ba849cf235ae41',
  measurementId: 'G-DVYC3JHRZQ',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
