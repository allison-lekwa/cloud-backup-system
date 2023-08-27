import { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean
}

export interface JwtRefreshTokenPayload {
  email: string;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}