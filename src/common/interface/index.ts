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

export enum S3FilePrivacy {
  PRIVATE = 'private',
  PUBLIC_READ = 'public-read',
  PUBLIC_READ_WRITE = 'public-read-write',
  AUTHENTICATED_READ = 'authenticated-read',
}