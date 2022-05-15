import { Express } from 'express';
import audio from './api/audio';
import image from './api/image';
import register from './api/register';
import users from './api/users';
import profile from './api/profile';

const API_PATH = '/api/v1';

export default (app: Express) => {
  [audio, image, register, users, profile].forEach((route) => {
    app.use(API_PATH, route);
  });
};
