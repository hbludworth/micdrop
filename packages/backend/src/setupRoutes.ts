import { Express } from 'express';
import audio from './api/audio';

const API_PATH = '/api/v1';

export default (app: Express) => {
  [audio].forEach((route) => {
    app.use(API_PATH, route);
  });
};
