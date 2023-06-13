import express from 'express';
import { v4 } from 'uuid';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import { HttpBadRequest, HttpInternalError } from '../exceptions';
import sl from '../serviceLocator';
import authenticatedRoute from '../middlewares/authenticatedRoute';
import { AudioMessageWithUrl, CustomPlaybackDisplay } from 'types';

const router = express.Router();

router
  .route('/audio/:uuid')
  .delete(authenticatedRoute, async (req, res, next) => {
    try {
      const s3 = new AWS.S3();
      const AudioDao = sl.get('AudioDao');

      const userUuid = req.user!.uuid;
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
  try {
    const AudioDao = sl.get('AudioDao');

    const userUuid = req.user!.uuid;
    const customPlaybackUuid = req.query.customPlaybackUuid as string;

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

    await AudioDao.createAudio(uuid, userUuid, 'wav', customPlaybackUuid);

    res.status(201).json(uuid);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router
  .route('/audio_label/:uuid')
  .patch(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioDao = sl.get('AudioDao');

      const { uuid } = req.params;
      const { label }: { label: string } = req.body;
      const userUuid = req.user!.uuid;

      const audioMessageExists = await AudioDao.audioMessageExists(uuid);
      if (!audioMessageExists) {
        next(new HttpBadRequest('The requested audio message does not exist.'));
        return;
      }

      const audioBelongsToUser = await AudioDao.audioBelongsToUser(
        uuid,
        userUuid
      );
      if (!audioBelongsToUser) {
        next(
          new HttpBadRequest(
            'The audio message does not belong to the current user.'
          )
        );
        return;
      }

      await AudioDao.editLabel(uuid, label);

      res.status(204).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router.route('/audio_message/:uuid').get(async (req, res, next) => {
  try {
    const s3 = new AWS.S3();
    const AudioDao = sl.get('AudioDao');
    const CustomPlaybackDao = sl.get('CustomPlaybackDao');

    const { uuid } = req.params;

    const audioMessageExists = await AudioDao.audioMessageExists(uuid);
    if (!audioMessageExists) {
      next(new HttpBadRequest('The requested audio message does not exist.'));
      return;
    }

    const audioMessage = await AudioDao.getAudioMessageByUuid(uuid);

    const customPlaybackRow = await CustomPlaybackDao.getCustomPlaybackByUuid(
      audioMessage.customPlaybackUuid
    );

    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: 'micdrop-audio',
      Key: `${audioMessage.uuid}.${audioMessage.fileType}`,
    });

    const circleImageUrl =
      customPlaybackRow && customPlaybackRow.circleImage
        ? await s3.getSignedUrlPromise('getObject', {
            Bucket: 'micdrop-custom-images',
            Key: customPlaybackRow.circleImage,
          })
        : null;

    const signatureImageUrl =
      customPlaybackRow && customPlaybackRow.signatureImage
        ? await s3.getSignedUrlPromise('getObject', {
            Bucket: 'micdrop-custom-images',
            Key: customPlaybackRow.signatureImage,
          })
        : null;

    const customPlaybackDisplay: CustomPlaybackDisplay = {
      ...customPlaybackRow,
      circleImageUrl: circleImageUrl,
      signatureImageUrl: signatureImageUrl,
    };

    const audioMessageWithUrl: AudioMessageWithUrl = {
      ...audioMessage,
      url,
      customPlayback: customPlaybackDisplay,
    };

    res.json(audioMessageWithUrl);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router
  .route('/audio/:uuid/:groupUuid')
  .patch(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioDao = sl.get('AudioDao');
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const { uuid } = req.params;
      const groupUuid =
        req.params.groupUuid !== 'null' ? req.params.groupUuid : null;
      const userUuid = req.user!.uuid;

      const audioMessageExists = await AudioDao.audioMessageExists(uuid);
      if (!audioMessageExists) {
        next(new HttpBadRequest('The requested audio message does not exist.'));
        return;
      }

      const audioBelongsToUser = await AudioDao.audioBelongsToUser(
        uuid,
        userUuid
      );
      if (!audioBelongsToUser) {
        next(
          new HttpBadRequest(
            'The audio message does not belong to the current user.'
          )
        );
        return;
      }

      if (groupUuid) {
        const audioGroupExists = await AudioGroupsDao.audioGroupExists(
          groupUuid
        );
        if (!audioGroupExists) {
          next(new HttpBadRequest('The audio group does not exist.'));
          return;
        }
      }

      await AudioDao.addGroupToAudio(uuid, groupUuid);

      res.status(201).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
