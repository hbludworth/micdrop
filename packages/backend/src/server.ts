import app from './app';
import sl from './serviceLocator';
import { User } from 'types';
import UserDao from './api/daos/UserDao';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

sl.set('UserDao', UserDao);

app.listen(8081, () => {
  console.log('The server is listening on port 8081...');
});
