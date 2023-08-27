import * as dotenv from 'dotenv';
// get config vars
dotenv.config();

const env = (key: string, defaultVal: any = undefined) => {
  return process.env[key] || defaultVal;
};

env.require = (key: string, defaultVal: any = undefined) => {
  const value = process.env[key] || defaultVal;
  if (!value) {
    throw new Error(`Environment variable '${key}' is missing!`);
  }

  return value;
};

const appConfig = {
  environment: env.require('NODE_ENV', 'development'),
  app: {
    name: 'cloud-backup-system',
    port: parseInt(env('APP_PORT', 3001)),
    hostname: env('APP_HOSTNAME', '0.0.0.0'),
    host: env(
      'APP_HOST',
      `http://localhost:${parseInt(env('APP_PORT', 3001))}`,
    ),
    api: {
      version: env('APP_API_VERSION', 'api/v1'),
    },
  },
  db: {
    url: env.require('DATABASE_URL'),
  },

  redis: {
    password: env('REDIS_PASSWORD'),
    url: env('REDIS_URL'),
    cacheTtl: parseInt(env.require('CACHE_TTL')),
  },

  jwt: {
    secret: env.require('JWT_SECRET'),
    refreshSecret: env.require('JWT_REFRESH_SECRET'),
    verificationSecret: env.require('JWT_VERIFATION_SECRET'),
    signOptions: {
      expiresIn: parseInt(env('JWT_EXPIRES', 30 * 60)),
    },
    refreshTokenExpiresIn: parseInt(
      env(
        'JWT_REFRESH_TOKEN_EXPIRES',
        6 * 60 * 60, // 6 hrs
      ),
    ),
    verificationTokenExpiresIn: parseInt(
      env(
        'JWT_VERIFICATIN_TOKEN_EXPIRES',
        5 * 60, // 5 mins
      )
    ),
    passwordResetTokenExpiresIn: parseInt(
      env(
        'JWT_RESET_TOKEN_EXPIRES',
        5 * 60,
      )
    )
  },

  aws: {
    S3Region: env.require('AWS_S3_REGION'),
    S3Key: env.require('AWS_S3_ACCESS_KEY_ID'),
    S3Secret: env.require('AWS_S3_ACCESS_KEY_SECRET'),
    S3Bucket: env.require('AWS_S3_BUCKET'),
  },

};

export default appConfig;


