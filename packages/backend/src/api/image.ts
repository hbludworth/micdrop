import express from 'express';
import AWS from 'aws-sdk';

const router = express.Router();

router.route('/image/:key').get(async (req, res, _next) => {
  const s3 = new AWS.S3();

  // FIXME temporary fix while awaiting review

  let { key } = req.params;

  if (!key.includes('.')) {
    key += '.png';
  }

  const params = {
    Bucket: 'micdrop-images',
    Key: key,
  };

  const image = (await s3.getObject(params).promise()).Body;

  if (image) {
    res.send(image).end();
  } else {
    res.status(404).end();
  }
});

export default router;
