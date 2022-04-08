import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be valide"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if the email has been used
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new BadRequestError("Email in use"));
    }
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // ! tells TS that we know this property is exist
      process.env.JWT_KEY!
    );

    // Store it on session obj
    // req.session.jwt = userJWT;
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
