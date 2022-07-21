import express from 'express';
import AWS from 'aws-sdk';
import { HttpInternalError, HttpBadRequest } from '../exceptions';
import proRoute from '../middlewares/proRoute';
import fileUpload from 'express-fileupload';

const router = express.Router();

router.route('/image/:key').get(async (req, res, next) => {
  try {
    const s3 = new AWS.S3();

    let { key } = req.params;

    const params = {
      Bucket: 'micdrop-images',
      Key: key,
    };

    // FIXME temp fix
    if (key === 'placeholder-v2.png') {
      const image = (await s3.getObject(params).promise()).Body;
      if (image) {
        res.send(image).end();
      } else {
        res.status(404).end();
      }
      return;
    }

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

router.route('/image/upload/:key').post(proRoute, async (req, res, next) => {
  try {
    const s3 = new AWS.S3();
    const { key } = req.params;

    if (!req.files) {
      res.status(400).end();
      return;
    }

    const file = req.files.newFile as fileUpload.UploadedFile;

    // FIXME crop and resize image with sharp

    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'micdrop-custom-images',
      Key: key,
      Body: file.data,
    };

    await s3.putObject(params).promise();

    res.status(201).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
