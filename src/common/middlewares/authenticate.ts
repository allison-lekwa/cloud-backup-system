import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interface";
import { decodeAccessToken, decodeRefreshToken, getTokenFromTokenHeader } from "./jwt";
import { BadRequestException, ForbiddenException, UnauthorizedException } from "../helper/throw-error";
import { UserService } from "@@/service/UserService";

const userService = new UserService();

export const authorizeAccess = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const tokenHeader = req.header('Authorization');
    const token = getTokenFromTokenHeader(tokenHeader);
    const decoded = decodeAccessToken(token);
    req.user = decoded
    next();
  } catch (error) {
    if (error.name === 'TypeError') {
        next(new BadRequestException('No token Provided'));
    } else if (error.name === 'JsonWebTokenError') {
        next(new BadRequestException('Invalid Token'));
    } else if (error.name === 'TokenExpiredError') {
        next(new BadRequestException('Token Expired'))
    } else {
        next(error);
    } 
  }
};

export const authorizeRefresh = async (req: RequestWithUser, resp: Response, next: NextFunction) => {
  try {
    const tokenHeader = req.header('Authorization');
    const token = getTokenFromTokenHeader(tokenHeader);
    const decoded = decodeRefreshToken(token);
    const tokenCache = await userService.getUserRefreshToken(decoded.email);

    if (tokenCache === token) {
        req.user = decoded;
        next(); 
    } else {
        throw new UnauthorizedException('Invalid refresh token');
    }
  } catch (error) {
    console.log(error);
    if (error.name === 'TypeError') {
        next(new BadRequestException('No token Provided'));
    } else if (error.name === 'JsonWebTokenError') {
        next(new BadRequestException('Invalid Token'));
    } else if (error.name === 'TokenExpiredError') {
        next(new BadRequestException('Token Expired'))
    }
    next(error)
  }
};

export const authorizeAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.user.isAdmin !== true) {
        throw new ForbiddenException('Access Denied');
    } else {
        next();
    }
  } catch (error) {
    next(error);
  }
};
