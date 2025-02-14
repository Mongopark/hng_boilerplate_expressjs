import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import config from "./config";
import passport from "./config/google.passport.config";
import AppDataSource from "./data-source";
import { errorHandler, routeNotFound } from "./middleware";
import {
  adminRouter,
  authRoute,
  billingPlanRouter,
  blogRouter,
  contactRouter,
  exportRouter,
  faqRouter,
  helpRouter,
  jobRouter,
  newsLetterSubscriptionRoute,
  paymentFlutterwaveRouter,
  paymentRouter,
  paymentStripeRouter,
  productRouter,
  billingRouter,
  runTestRouter,
  sendEmailRoute,
  testimonialRoute,
  userRouter,
  paymentPaystackRouter,
  squeezeRoute,
  notificationsettingsRouter,
  notificationRouter,
} from "./routes";
import { orgRouter } from "./routes/organisation";
import { smsRouter } from "./routes/sms";
import swaggerSpec from "./swaggerConfig";
import { Limiter } from "./utils";
import log from "./utils/logger";
import ServerAdapter from "./views/bull-board";
import { roleRouter } from "./routes/roles";
import { planRouter } from "./routes/plans";
dotenv.config();

const port = config.port;
const server: Express = express();
server.options("*", cors());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

server.use(Limiter);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(passport.initialize());

server.get("/", (req: Request, res: Response) => {
  res.send({ message: "I am the express API responding for team panther" });
});
server.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "I am the express API responding for team Panther" });
});

server.get("/api/v1/probe", (req: Request, res: Response) => {
  res.send("I am the express api responding for team panther");
});
server.use("/run-tests", runTestRouter);
server.use("/api/v1", faqRouter);
server.use("/api/v1", authRoute);
server.use("/api/v1", userRouter);
server.use("/api/v1/queues", ServerAdapter.getRouter());
server.use("/api/v1", adminRouter);
server.use("/api/v1", sendEmailRoute);
server.use("/api/v1", helpRouter);
server.use("/api/v1", productRouter);
server.use("/api/v1", paymentFlutterwaveRouter);
server.use("/api/v1", paymentStripeRouter);
server.use("/api/v1", smsRouter);
server.use("/api/v1", notificationsettingsRouter);
server.use("/api/v1", notificationRouter);
server.use("/api/v1", paymentRouter);
server.use("/api/v1", billingRouter);
server.use("/api/v1", orgRouter);
server.use("/api/v1", exportRouter);
server.use("/api/v1", testimonialRoute);
server.use("/api/v1", blogRouter);
server.use("/api/v1", contactRouter);
server.use("/api/v1", jobRouter);
server.use("/api/v1", roleRouter);
server.use("/api/v1", paymentPaystackRouter);
server.use("/api/v1", billingPlanRouter);
server.use("/api/v1", newsLetterSubscriptionRoute);
server.use("/api/v1", squeezeRoute);
server.use("/api/v1", planRouter);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(routeNotFound);
server.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
