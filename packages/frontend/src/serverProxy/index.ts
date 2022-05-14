import audio from './audio';
import image from './image';

const serverProxy = {
  ...audio,
  ...image,
};

export type ServerProxyType = typeof serverProxy;

export default serverProxy;
