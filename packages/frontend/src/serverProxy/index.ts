import audio from './audio';
import image from './image';
import users from './users';
import login from './login';
import logout from './logout';
import register from './register';
import resetPassword from './reset_password';
import profile from './profile';

const serverProxy = {
  ...audio,
  ...image,
  ...users,
  ...login,
  ...logout,
  ...register,
  ...resetPassword,
  ...profile,
};

export type ServerProxyType = typeof serverProxy;

export default serverProxy;