import { Request, Response, NextFunction } from 'express';
import { HttpInternalError, HttpForbidden } from '../exceptions';
import authenticatedRoute from './authenticatedRoute';

async function freeRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const navigateFree = (err?: any) => {
      if (err) {
        next(err);
        return;
      }
      const { user } = req;
      if (user && user.subscriptionLevel === 'free') {
        next();
      } else {
        next(new HttpForbidden('You are not authorized to access this route.'));
      }
    };

    authenticatedRoute(req, res, navigateFree);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
}

export default freeRoute;
