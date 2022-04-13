import { Request, Response, NextFunction } from "express";
import jwt, { Jwt } from "jsonwebtoken";

interface UserPayload {
  id: string,
  email: string,
}

// Add a property in Express.Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    req.currentUser = null;
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
  }
  next();
};
