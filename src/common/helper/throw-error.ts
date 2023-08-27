import { ERROR_CODE } from '../constant/ERROR_CODE';

import { Response } from 'express';

export const throwError = (
  errorObj: any,
  message?: string,
): { code: number; message: string } => {
  if (errorObj.code === ERROR_CODE.conflict) {
    return {
      code: 409,
      message: message || 'Resource already exists',
    };
  } else if (errorObj.code === ERROR_CODE.notFound) {
    return {
      code: 404,
      message: message || 'Resource not found',
    };
  } else if (errorObj.code === ERROR_CODE.unathorize) {
    return {
      code: 403,
      message: message || 'Unathorized',
    };
  } else if (errorObj.code === ERROR_CODE.badRequest) {
    return {
      code: 400,
      message: message || 'Bad request',
    };
  } else if (errorObj.code === ERROR_CODE.requestTimeout) {
    return {
      code: 408,
      message: message || 'Request time out',
    };
  } else {
    return {
      code: 500,
      message: message || 'Internal Server Error',
    };
  }
};

export const serverError = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.internal }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};

export const notFoundError = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.notFound }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};

export const unathorizedError = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.unathorize }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};

export const badRequestException = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.badRequest }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};

export const conflictException = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.conflict }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};

export const requestTimeoutException = (response: Response, message?: string) => {
  const err = throwError({ code: ERROR_CODE.requestTimeout }, message);
  return response.status(err.code).json({
    message: err.message,
    success: false,
  });
};
