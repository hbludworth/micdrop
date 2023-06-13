import express from 'express';
import { HttpInternalError } from '../exceptions';
import authenticatedRoute from '../middlewares/authenticatedRoute';
import sl from '../serviceLocator';
import {
  CreateNewCustomPlaybackPayload,
  CustomPlaybackDisplay,
  CustomPlaybackRow,
} from 'types';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import createPlaceholderImage from '../utils/placeholder';

const router = express.Router();

router
  .route('/custom_playback_options')
  .get(authenticatedRoute, async (req, res, next) => {
    try {
      const s3 = new AWS.S3();
      const userUuid = req.user!.uuid;

      const CustomPlaybackDao = sl.get('CustomPlaybackDao');

      const customPlaybackPublicOptions: CustomPlaybackRow[] =
        await CustomPlaybackDao.getCustomPlaybackOptionsByUserUuid(null);

      const customPlaybackOptions: CustomPlaybackRow[] =
        await CustomPlaybackDao.getCustomPlaybackOptionsByUserUuid(userUuid);

      const allCustomPlaybackOptions = [
        ...customPlaybackPublicOptions,
        ...customPlaybackOptions,
      ];

      const circleImageUrls: (string | null)[] = await Promise.all(
        allCustomPlaybackOptions.map((option) => {
          if (option.circleImage) {
            return s3.getSignedUrlPromise('getObject', {
              Bucket: 'micdrop-custom-images',
              Key: option.circleImage,
            });
          }

          return null;
        })
      );

      const signatureImageUrls: (string | null)[] = await Promise.all(
        allCustomPlaybackOptions.map((option) => {
          if (option.signatureImage) {
            return s3.getSignedUrlPromise('getObject', {
              Bucket: 'micdrop-custom-images',
              Key: option.signatureImage,
            });
          }

          return null;
        })
      );

      const customPlaybackDisplays: CustomPlaybackDisplay[] =
        allCustomPlaybackOptions.map((option, idx) => ({
          ...option,
          circleImageUrl: circleImageUrls[idx],
          signatureImageUrl: signatureImageUrls[idx],
        }));

      res.json(customPlaybackDisplays);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/custom_playback')
  .post(authenticatedRoute, async (req, res, next) => {
    try {
      const s3 = new AWS.S3();
      const CustomPlaybackDao = sl.get('CustomPlaybackDao');

      const userUuid = req.user!.uuid;
      const payload: CreateNewCustomPlaybackPayload = req.body;

      const newCustomPlayback: CustomPlaybackRow = {
        ...payload,
        uuid: v4(),
        userUuid,
      };

      await CustomPlaybackDao.createCustomPlayback(newCustomPlayback);

      const placeholderImage = await createPlaceholderImage(newCustomPlayback);

      const params: AWS.S3.PutObjectRequest = {
        Bucket: 'micdrop-placeholder-images',
        Key: `${newCustomPlayback.uuid}_placeholder.png`,
        Body: placeholderImage,
      };

      await s3.putObject(params).promise();

      res.json(newCustomPlayback).status(201);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
