import express from 'express';
import { v4 } from 'uuid';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import path from 'path';

const router = express.Router();

router.route('/audio/:uuid').get(async (req, res, _next) => {
  const { uuid } = req.params;

  res.sendFile(path.resolve(`./public/audio/${uuid}.mp3`), (err) => {
    if (err) {
      res.status(500).end();
    }
  });
});

router.route('/audio').post(async (req, res, _next) => {
  if (!req.files) {
    res.status(400).end();
    return;
  }

  const file = req.files.newFile as fileUpload.UploadedFile;

  const uuid = v4();

  fs.writeFile(`./public/audio/${uuid}.mp3`, file.data, (err) => {
    if (err) {
      res.status(500).end();
    }
  });

  res.status(201).json(uuid);
});

export default router;
