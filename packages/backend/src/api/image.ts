import express from 'express';
import AWS from 'aws-sdk';
import { HttpInternalError, HttpBadRequest } from '../exceptions';
import proRoute from '../middlewares/proRoute';
import fileUpload from 'express-fileupload';
import sharp from 'sharp';

const router = express.Router();

router.route('/image/:key').get(async (req, res, next) => {
  try {
    const s3 = new AWS.S3();

    const { key } = req.params;

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

router.route('/placeholder_image/:key').get(async (req, res, next) => {
  try {
    const s3 = new AWS.S3();

    const { key } = req.params;

    const params = {
      Bucket: 'micdrop-placeholder-images',
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

router
  .route('/image/upload/:type/:key')
  .post(proRoute, async (req, res, next) => {
    try {
      const s3 = new AWS.S3();
      const { type, key } = req.params;

      if (!req.files) {
        res.status(400).end();
        return;
      }

      const file = req.files.newFile as fileUpload.UploadedFile;

      let formattedImage: Buffer;

      if (type === 'circle') {
        formattedImage = await sharp(file.data)
          .toFormat('png')
          .resize(200, 200, {
            fit: 'cover',
            position: 'center',
          })
          .toBuffer();
      } else if (type === 'signature') {
        formattedImage = await sharp(file.data)
          .toFormat('png')
          .resize(null, 30, {
            fit: 'contain',
            position: 'center',
          })
          .toBuffer();
      } else {
        throw new Error('Invalid image upload type');
      }

      const params: AWS.S3.PutObjectRequest = {
        Bucket: 'micdrop-custom-images',
        Key: key,
        Body: formattedImage,
      };

      await s3.putObject(params).promise();

      res.status(201).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
