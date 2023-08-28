import express from "express"
import multer, { Multer, FileFilterCallback, diskStorage } from 'multer'
// import multerS3 from 'multer-s3'
import path from 'path';
import appConfig from '../../app.config'
import { RequestWithUser } from '../interface';
import { BadRequestException } from './throw-error';
// import { S3Client } from '@aws-sdk/client-s3';
const app = express();

const S3Region = appConfig.aws.S3Region;
const S3Key = appConfig.aws.S3Key;
const S3Secret = appConfig.aws.S3Secret;
const S3Bucket = appConfig.aws.S3Bucket;

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
export const fileStorage = diskStorage({
  destination: ((req: RequestWithUser, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null,  path.join(__dirname, 'public/'));
  }),
  filename: (req: RequestWithUser, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, file.originalname);
  },
});

export const fileMemoryStorage = multer.memoryStorage();

export const fileFilter = (req: RequestWithUser, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.originalname.match(/\.(mp4|MPEG-4|mkv|mp3|M4A|png|jpg|jpeg|docx|pdf|doc)$/)) {
    callback(null, true)
  } else {
      callback(null, false)
      return callback(new BadRequestException('File type not acceptable'));
  }
}
