import app from './app';
import sl from './serviceLocator';
import { User } from 'types';
import UserDao from './api/daos/UserDao';
import AudioDao from './api/daos/AudioDao';
import AudioGroupsDao from './api/daos/AudioGroupsDao';
import { initializeFirebase } from './firebase';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

sl.set('UserDao', UserDao);
sl.set('AudioDao', AudioDao);
sl.set('AudioGroupsDao', AudioGroupsDao);

initializeFirebase((err) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  } else {
    app.listen(8081, () => {
      console.log('Listening on port 8081'); // eslint-disable-line no-console
    });
  }
});
