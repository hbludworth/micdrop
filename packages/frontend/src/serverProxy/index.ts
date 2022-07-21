import audio from './audio';
import image from './image';
import users from './users';
import login from './login';
import logout from './logout';
import register from './register';
import resetPassword from './reset_password';
import profile from './profile';
import audioGroups from './audio_groups';
import customPlayback from './custom_playback';

const serverProxy = {
  ...audio,
  ...image,
  ...users,
  ...login,
  ...logout,
  ...register,
  ...resetPassword,
  ...profile,
  ...audioGroups,
  ...customPlayback,
};

export type ServerProxyType = typeof serverProxy;

export default serverProxy;
