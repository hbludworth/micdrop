import express from 'express';
import AWS from 'aws-sdk';

const router = express.Router();

router.route('/image/placeholder').get(async (_req, res, _next) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 'micdrop-images',
    Key: 'placeholder.png',
  };

  const image = (await s3.getObject(params).promise()).Body;

  if (image) {
    res.contentType('png');
    res.send(image).end();
  } else {
    res.status(404).end();
  }
});

router.route('/image/logo').get(async (_req, res, _next) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 'micdrop-images',
    Key: 'logo.png',
  };

  const image = (await s3.getObject(params).promise()).Body;

  if (image) {
    res.contentType('png');
    res.send(image).end();
  } else {
    res.status(404).end();
  }
});

export default router;
