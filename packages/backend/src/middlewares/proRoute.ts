import { Request, Response, NextFunction } from 'express';
import { HttpInternalError, HttpForbidden } from '../exceptions';
import authenticatedRoute from './authenticatedRoute';

async function proRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const navigatePro = (err?: any) => {
      if (err) {
        next(err);
        return;
      }
      const { user } = req;
      if (user && user.subscriptionLevel === 'pro') {
        next();
      } else {
        next(new HttpForbidden('You are not authorized to access this route.'));
      }
    };

    authenticatedRoute(req, res, navigatePro);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
}

export default proRoute;
