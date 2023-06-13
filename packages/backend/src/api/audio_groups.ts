import express from 'express';
import { HttpBadRequest, HttpInternalError } from '../exceptions';
import sl from '../serviceLocator';
import authenticatedRoute from '../middlewares/authenticatedRoute';

const router = express.Router();

router
  .route('/audio_groups')
  .get(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const userUuid = req.user!.uuid;

      const audioGroups = await AudioGroupsDao.getUserAudioGroups(userUuid);

      res.json(audioGroups);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  })
  .post(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const userUuid = req.user!.uuid;
      const { name }: { name: string } = req.body;

      await AudioGroupsDao.createAudioGroup(userUuid, name);

      res.status(201).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

router
  .route('/audio_groups/:groupUuid')
  .get(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioDao = sl.get('AudioDao');
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const userUuid = req.user!.uuid;
      const groupUuid =
        req.params.groupUuid !== 'null' ? req.params.groupUuid : null;

      // Null is used to represent the "All" group

      if (groupUuid) {
        const audioGroupBelongsToUser =
          await AudioGroupsDao.audioGroupBelongsToUser(groupUuid, userUuid);
        if (!audioGroupBelongsToUser) {
          next(
            new HttpBadRequest(
              'You do not have permission to access this audio group.'
            )
          );
          return;
        }
      }

      const audioMessages = await AudioDao.getAudioMessagesByGroup(
        groupUuid,
        userUuid
      );

      res.json(audioMessages);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  })
  .delete(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioDao = sl.get('AudioDao');
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const { groupUuid } = req.params;
      const userUuid = req.user!.uuid;

      const audioGroupExists = await AudioGroupsDao.audioGroupExists(groupUuid);
      if (!audioGroupExists) {
        next(
          new HttpBadRequest('Cannot delete audio group that does not exist.')
        );
        return;
      }

      const audioGroupBelongsToUser =
        await AudioGroupsDao.audioGroupBelongsToUser(groupUuid, userUuid);
      if (!audioGroupBelongsToUser) {
        next(
          new HttpBadRequest(
            'You do not have permission to access this audio group.'
          )
        );
        return;
      }

      await AudioDao.removeGroupFromAudio(groupUuid);
      await AudioGroupsDao.deleteGroup(groupUuid);

      res.status(204).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  })
  .patch(authenticatedRoute, async (req, res, next) => {
    try {
      const AudioGroupsDao = sl.get('AudioGroupsDao');

      const { groupUuid } = req.params;
      const userUuid = req.user!.uuid;
      const { name }: { name: string } = req.body;

      const audioGroupExists = await AudioGroupsDao.audioGroupExists(groupUuid);
      if (!audioGroupExists) {
        next(
          new HttpBadRequest('Cannot rename audio group that does not exist.')
        );
        return;
      }

      const audioGroupBelongsToUser =
        await AudioGroupsDao.audioGroupBelongsToUser(groupUuid, userUuid);
      if (!audioGroupBelongsToUser) {
        next(
          new HttpBadRequest(
            'You do not have permission to access this audio group.'
          )
        );
        return;
      }

      await AudioGroupsDao.renameGroup(groupUuid, name);

      res.status(204).end();
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
