import express from 'express';
import path from 'path';

const router = express.Router();

router.route('/image/placeholder').get(async (_req, res, _next) => {
  res.sendFile(
    path.resolve(`./public/images/PlaceholderScrubber.png`),
    (err) => {
      if (err) {
        res.status(500).end();
      }
    }
  );
});

router.route('/image/logo').get(async (_req, res, _next) => {
  res.sendFile(path.resolve(`./public/images/MicDropLogo.png`), (err) => {
    if (err) {
      res.status(500).end();
    }
  });
});

router.route('/image/test').get(async (_req, res, _next) => {
  res.json('cheese');
});

export default router;
