import express from 'express';
import { v4 } from 'uuid';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import { HttpBadRequest, HttpInternalError } from '../exceptions';
import sl from '../serviceLocator';
import authenticatedRoute from '../middlewares/authenticatedRoute';

const router = express.Router();

router
  .route('/audio/:uuid')
  .get(async (req, res, next) => {
    try {
      const { uuid } = req.params;

      const s3 = new AWS.S3();

      const params: AWS.S3.GetObjectRequest = {
        Bucket: 'micdrop-audio',
        Key: `${uuid}.wav`,
      };

      const signedUrl = await s3.getSignedUrlPromise('getObject', params);

      if (signedUrl) {
        res.json(signedUrl);
      } else {
        next(new HttpBadRequest('This audio file does not exist.'));
        return;
      }
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  })
  .delete(authenticatedRoute, async (req, res, next) => {
    const AudioDao = sl.get('AudioDao');

    const userUuid = req.user!.uuid;

    try {
      const { uuid } = req.params;

      const audioBelongsToUser = await AudioDao.audioBelongsToUser(
        uuid,
        userUuid
      );
      if (!audioBelongsToUser) {
        next(
          new HttpBadRequest(
            'Cannot delete audio file that does not belong to the current user'
          )
        );
        return;
      }

      const s3 = new AWS.S3();

      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: 'micdrop-audio',
        Key: `${uuid}.wav`,
      };

      await s3.deleteObject(params).promise();

      await AudioDao.deleteAudio(uuid);

      res.status(200).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router.route('/audio').post(authenticatedRoute, async (req, res, next) => {
  const AudioDao = sl.get('AudioDao');

  const userUuid = req.user!.uuid;

  try {
    if (!req.files) {
      next(new HttpBadRequest('No file was attached for upload.'));
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

    await AudioDao.createAudio(uuid, userUuid, 'wav');

    res.status(201).json(uuid);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
