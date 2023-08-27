import bcrypt from 'bcrypt';
import { badRequestException, conflictException, notFoundError, requestTimeoutException, unathorizedError } from './common/helper/throw-error';
import { Response } from 'express';
export class AppUtilities {
  public static async hashAuthSecret(secret: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(secret, salt);
  }

  public static async validatePassword(
    password: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(password, hashedPassword);
  }

  public static requestErrorHandler = (response: any = {}) => {
    const {
      message: errorMessage,
      response: serverResp,
      isCancel,
      isNetwork,
      config,
    } = response;

    let message = errorMessage,
      data: any = {},
      isServerError = false;

    if (serverResp?.data) {
      isServerError = true;
      message =
        serverResp.data?.error ||
        serverResp.data?.message ||
        'Unexpected error occurred!';
      data =
        typeof serverResp.data === 'object'
          ? { ...serverResp.data }
          : { data: serverResp.data };
      delete data.message;
    } else if (isCancel) {
      message = 'Request timed out.';
    } else if (isNetwork) {
      message = 'Network not available!';
    }

    const errorData = {
      message,
      isServerError,
      ...(isServerError && {
        data: {
          ...data,
          errorMessage,
          api: {
            method: config?.method,
            url: config?.url,
            baseURL: config?.baseURL,
          },
        },
      }),
    };

    return errorData;
  };
  public static handleException(error: any, res: Response): Response {
    console.error(AppUtilities.requestErrorHandler(error));
    const errorCode: string = error.code;
    const message: string = error.meta
      ? error.meta.cause
        ? error.meta.cause
        : error.meta.field_name
        ? error.meta.field_name
        : error.meta.column
        ? error.meta.table
        : error.meta.table
      : error.message;
    switch (errorCode) {
      case 'P0000':
      case 'P2003':
      case 'P2004':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        return notFoundError(res, message);
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2009':
      case 'P2010':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
      case 'P2017':
      case 'P2019':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2026':
      case 'P2027':
        return badRequestException(res, message);
      case 'P2024':
        return requestTimeoutException(res, message);
      case 'P0001':
        return unathorizedError(res, message);
      case 'P2002':
        const msg = `Conflict Exception: '${error.meta?.target?.[0]}' already exists!`;
        return conflictException(res, error.meta?.target?.[0] ? msg : message);
      default:
        console.error(message);
        if (!!message && message.toLocaleLowerCase().includes('arg')) {
          return badRequestException(res,
            'Invalid/Unknown field was found in the data set!',
          );
        } else {
          return error;
        }
    }
  }
}