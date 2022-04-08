import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

// Error-handling middleware has 4 args (err, req, res, next)
// Normal middleware has only 3 args(req, res, next)

// now we try to produce error but not catch error
// so we create a normal middleware
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new RequestValidationError(errors.array()));
  }

  return next();
};
