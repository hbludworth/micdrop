import { Express } from 'express';
import audio from './api/audio';
import image from './api/image';
import register from './api/register';
import users from './api/users';
import profile from './api/profile';
import audioGroups from './api/audio_groups';
import customPlayback from './api/custom_playback';

const API_PATH = '/api/v1';

export default (app: Express) => {
  [audio, image, register, users, profile, audioGroups, customPlayback].forEach(
    (route) => {
      app.use(API_PATH, route);
    }
  );
};
