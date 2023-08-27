// redis ttl and jwt ttl for verify -> describe
// passwordResetSecret + oldPassword -> abr redis er ttl thakbe ki na

import { JwtPayload } from "../interface";

// write -> refresh token ttl === refresh token redis key ttl, checking -> how?

const { sign, verify } = require('jsonwebtoken');
import appConfig from '../../app.config'

const jwtSecret = appConfig.jwt.secret;
const jwtExpires = appConfig.jwt.signOptions.expiresIn;
const jwtRefreshExpires = appConfig.jwt.refreshTokenExpiresIn;

export const generateAccessToken =  async (dto: JwtPayload) => {
    const payload = { email: dto.email, userId: dto.userId, isAdmin: dto.isAdmin };
    const secret = jwtSecret;
    const options = { expiresIn: jwtExpires };
    const token = await sign(payload, secret, options);
    return token
    
};

export const generateRefreshToken =  async (dto: JwtPayload) => {
    const payload = { email: dto.email, userId: dto.userId, isAdmin: dto.isAdmin };
    const secret = jwtSecret;
    const options = { expiresIn: jwtRefreshExpires};
    const token = await sign(payload, secret, options);
    return token
};

export const generateVerificationToken = async (email: string) => {
    const payload = { email: email };
    const secret = jwtSecret;
    const options = { expiresIn: jwtExpires };
    const token = await sign(payload, secret, options);
  
    return token
}

export const generatePasswordResetToken = (email: string, oldPassword: string) => {
    const payload = { email: email };
    const secret = jwtSecret + oldPassword;
    const options = { expiresIn: jwtExpires };
    const token = sign(payload, secret, options);
    return token;
}

export const decodeAccessToken = (accessToken: string) => {
    return verify(accessToken, jwtSecret);
}

export const decodeRefreshToken = (refreshToken: string) => {
    return verify(refreshToken, jwtSecret);
}

module.exports.decodeVerificationToken = (verificationToken: string) => {
    return verify(verificationToken, jwtSecret)
}

export const decodePasswordResetToken = (passwordResetToken: string, currentPassword: string) => {
    const secret = jwtSecret + currentPassword;
    return verify(passwordResetToken, secret);
}

export const getTokenFromTokenHeader = (tokenHeader: string) => {
    return tokenHeader.split(" ")[1].trim();
}