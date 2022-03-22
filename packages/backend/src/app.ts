import express from 'express';
import history from 'connect-history-api-fallback';
import setupRoutes from './setupRoutes';

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

setupRoutes(app);

app.use(history());

export default app;
