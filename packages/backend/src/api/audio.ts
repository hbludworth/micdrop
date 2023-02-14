import express from 'express';
import { v4 } from 'uuid';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import { HttpBadRequest, HttpInternalError } from '../exceptions';
import sl from '../serviceLocator';
import authenticatedRoute from '../middlewares/authenticatedRoute';
import proRoute from '../middlewares/proRoute';
import { AudioLimits, AudioMessageWithUrl, CustomPlaybackDisplay } from 'types';

const router = express.Router();

router
  .route('/audio_has_recent')
  .get(authenticatedRoute, async (req, res, next) => {
    const AudioDao = sl.get('AudioDao');

    try {
      const userUuid = req.user!.uuid;

      const hasRecentAudio = await AudioDao.hasRecentAudio(userUuid);

      res.json(hasRecentAudio);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/audio_most_recent')
  .get(authenticatedRoute, async (req, res, next) => {
    const AudioDao = sl.get('AudioDao');

    try {
      const userUuid = req.user!.uuid;

      const uuid = await AudioDao.getMostRecentAudio(userUuid);

      if (!uuid) {
        res.status(404).end();
        return;
      }

      res.json(uuid);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/audio/:uuid')
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

    const customPlaybackUuid = req.query.customPlaybackUuid as string;

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

router.route('/audio_limit').get(authenticatedRoute, async (req, res, next) => {
  const AudioDao = sl.get('AudioDao');

  try {
    const userUuid = req.user!.uuid;
    const subscriptionLevel = req.user!.subscriptionLevel;

    if (subscriptionLevel !== 'free') {
      const response: AudioLimits = {
        monthlyMessagesLeft: null,
      };
      res.json(response);
      return;
    }

    const messagesLeft = await AudioDao.getMonthlyMessagesLeft(userUuid);
    const response: AudioLimits = {
      monthlyMessagesLeft: messagesLeft,
    };
    res.json(response);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router.route('/audio_label/:uuid').patch(proRoute, async (req, res, next) => {
  const AudioDao = sl.get('AudioDao');

  try {
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
    const AudioDao = sl.get('AudioDao');
    const CustomPlaybackDao = sl.get('CustomPlaybackDao');
    const s3 = new AWS.S3();

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
  .patch(proRoute, async (req, res, next) => {
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
