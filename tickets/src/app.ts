import express, { NextFunction } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all("*", async (req, res, next) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

export { app };
