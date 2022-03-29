import { Express } from 'express';
import audio from './api/audio';
import image from './api/image';

const API_PATH = '/api/v1';

export default (app: Express) => {
  [audio, image].forEach((route) => {
    app.use(API_PATH, route);
  });
};
