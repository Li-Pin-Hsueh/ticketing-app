import express, { NextFunction } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

import { errorHandler, NotFoundError, currentUser } from "@pintickets/common";

const app = express();
// traffic is being proxy to our APP throught ingress nginx
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

export { app };
