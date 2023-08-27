import { NextFunction, Request, Response } from "express";
import { AppUtilities } from "../../app.utilities";

const ErrorInterceptor = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware Error Handling");
  const error = AppUtilities.handleException(err, res)
  const statusCode = error.getCode();
  return res.status(statusCode).json({
    success: false,
    message: error.message
  });
}

export default ErrorInterceptor;