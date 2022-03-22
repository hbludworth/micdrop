import express from 'express';

const router = express.Router();

router.route('/audio').get(async (req, res, next) => {
  res.json('well done thou good and faithful');
});

export default router;
