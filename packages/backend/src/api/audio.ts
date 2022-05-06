import express from 'express';
import { v4 } from 'uuid';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';

const router = express.Router();

router.route('/audio/:uuid').get(async (req, res, _next) => {
  const { uuid } = req.params;

  const s3 = new AWS.S3();

  const params = {
    Bucket: 'micdrop-audio',
    Key: `${uuid}.wav`,
  };

  const audioFile = (await s3.getObject(params).promise()).Body;

  if (audioFile) {
    res.contentType('audio/x-wav');
    res.send(audioFile).end();
  } else {
    res.status(404).end();
  }
});

router.route('/audio').post(async (req, res, _next) => {
  if (!req.files) {
    res.status(400).end();
    return;
  }

  const s3 = new AWS.S3();

  const file = req.files.newFile as fileUpload.UploadedFile;

  const uuid = v4();

  const params: AWS.S3.PutObjectRequest = {
    Bucket: 'micdrop-audio',
    Key: `${uuid}.wav`,
    Body: file.data,
  };

  await s3.putObject(params).promise();

  res.status(201).json(uuid);
});

export default router;
