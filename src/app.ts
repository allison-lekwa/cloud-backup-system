import express, { Request, Response } from "express"
import bodyParser from "body-parser";
import cors from 'cors';
import appConfig from './app.config'
import { Routes } from "./routes";
import ErrorInterceptor from "./common/middlewares/error-interceptor";
import cacheClient from "./common/helper/cache-client";
import { RequestWithUser } from "./common/interface";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register express routes from defined application routes
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    route.middleware
      ? route.middleware
      : (_req, _res, next) => {
          next();
        },
    route.validation ? route.validation
    : (_req, _res, next) => {
        next();
      },
    (req: RequestWithUser, res: Response, next: Function) => {
      const result = new (route.controller as any)()[route.action](
        req,
        res,
        next,
      );
      result.then(
        (result) =>
          result !== null && result !== undefined
            ? res.send(result.data)
            : undefined,
      )
    },
  );
});
app.use(ErrorInterceptor)

const PORT = appConfig.app.port;

app.listen(PORT, async () => {
  try {
    await cacheClient.connect();
    console.log(`Server is running on port ${PORT}`)
  }catch(error) {
    console.log(error)
  }
})
