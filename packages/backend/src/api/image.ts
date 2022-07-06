import express from 'express';
import AWS from 'aws-sdk';
import { HttpInternalError, HttpBadRequest } from '../exceptions';

const router = express.Router();

router.route('/image/:key').get(async (req, res, next) => {
  try {
    const s3 = new AWS.S3();

    let { key } = req.params;

    const params = {
      Bucket: 'micdrop-images',
      Key: key,
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);

    if (signedUrl) {
      res.json(signedUrl);
    } else {
      next(new HttpBadRequest('This image does not exist.'));
      return;
    }
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
