import { AppUtilities } from "../../app.utilities";

// ErrorHandler.js
const ErrorInterceptor = (err, req, res, next) => {
  console.log("Middleware Error Hadnling");
  return AppUtilities.handleException(err, res)
}

export default ErrorInterceptor;