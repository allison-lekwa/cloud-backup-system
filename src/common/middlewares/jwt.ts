// redis ttl and jwt ttl for verify -> describe
// passwordResetSecret + oldPassword -> abr redis er ttl thakbe ki na

import { JwtPayload } from "../interface";

// write -> refresh token ttl === refresh token redis key ttl, checking -> how?

const { sign, verify } = require('jsonwebtoken');
import appConfig from '../../app.config'

const jwtSecret = appConfig.jwt.secret;
const jwtExpires = appConfig.jwt.signOptions.expiresIn;
const jwtRefreshExpires = appConfig.jwt.refreshTokenExpiresIn;

export const generateAccessToken =  (dto: JwtPayload) => {
    const payload = { email: dto.email, userId: dto.userId, isAdmin: dto.isAdmin };
    const secret = jwtSecret;
    const options = { expiresIn: jwtExpires };
    const token = sign(payload, secret, options);
    return token
    
};

module.exports.generateRefreshToken =  (dto: JwtPayload) => {
    const payload = { email: dto.email, userId: dto.userId, isAdmin: dto.isAdmin };
    const secret = jwtRefreshSecret;
    const options = { expiresIn: jwtRefreshExpires};
    const token = sign(payload, secret, options);
    return token
};

module.exports.generateVerificationToken = (email: string) => {
    const payload = { email: email };
    const secret = jwtVerificationSecret;
    const options = { expiresIn: jwtVerificationExpires };
    const token = sign(payload, secret, options);
  
    return token
}

module.exports.generatePasswordResetToken = (email: string, oldPassword: string) => {
    const payload = { email: email };
    const secret = jwtRefreshSecret + oldPassword;
    const options = { expiresIn: jwt };
    const token = sign(payload, secret, options);
    return token;
}

module.exports.decodeAccessToken = (accessToken: string) => {
    return verify(accessToken, accessTokenSecret);
}

module.exports.decodeRefreshToken = (refreshToken: string) => {
    return verify(refreshToken, refreshTokenSecret);
}

module.exports.decodeVerificationToken = (verificationToken: string) => {
    return verify(verificationToken, verificationSecret)
}

module.exports.decodePasswordResetToken = (passwordResetToken: string, currentPassword: string) => {
    const secret = passwordResetSecret + currentPassword;
    return verify(passwordResetToken, secret);
}

module.exports.getTokenFromTokenHeader = (tokenHeader: string) => {
    return tokenHeader.split(" ")[1].trim();
}