import express from 'express';

const router = express.Router();

router
  .route('/audio/:uuid')
  .get(async (req, res, next) => {
    const { uuid } = req.params;
    res.json(`The sent uuid is: ${uuid}`);
  })
  .post(async (req, res, next) => {
    const { uuid } = req.params;
    const audioFile = req.body;
  });

export default router;
