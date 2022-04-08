import express, { NextFunction, Request, Response } from "express";
import { validateRequest } from "../middlewares/validate-request";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must nbe valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // It's a bad request error
      return next(new BadRequestError("User not exist..."));
    }

    // Compare the pwd
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      return next(new BadRequestError("Wrong password..."));
    }

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // store it on session obj
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
