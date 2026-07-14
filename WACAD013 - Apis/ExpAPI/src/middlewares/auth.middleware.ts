import { Request, Response, NextFunction } from 'express';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  userTypeId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const fakeAuthSession: { user?: AuthUser } = {};

export const setAuthUser = (user: AuthUser | null) => {
  if (!user) {
    fakeAuthSession.user = undefined;
    return;
  }

  fakeAuthSession.user = user;
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!fakeAuthSession.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = fakeAuthSession.user;
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!fakeAuthSession.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (fakeAuthSession.user.userTypeId !== 2) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = fakeAuthSession.user;
  next();
};
