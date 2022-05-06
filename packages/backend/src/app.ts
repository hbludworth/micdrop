import express from 'express';
import fileupload from 'express-fileupload';
import history from 'connect-history-api-fallback';
import setupRoutes from './setupRoutes';
import path from 'path';

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

app.use(express.json());
app.use(fileupload());

setupRoutes(app);

app.use(history());

app.use(express.static(path.join(__dirname, '../../dist')));

export default app;
