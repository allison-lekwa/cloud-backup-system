
import multer, { FileFilterCallback } from 'multer'
import path from 'path';
import appConfig from '../../app.config'
import { RequestWithUser } from '../interface';
import { BadRequestException } from './throw-error';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
let fileStorage = multer.diskStorage({
  destination: ((req: RequestWithUser, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null,  path.join(__dirname, 'public/'));
  }),
  filename: (req: RequestWithUser, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, file.originalname);
  },
});

export const multerUpload = multer({
    storage: fileStorage,
    fileFilter: (req: RequestWithUser, file: Express.Multer.File, callback: FileFilterCallback): void => {
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|mp3|M4A|png|jpg|jpeg|docx|pdf|doc)$/)) {
        callback(null, true)
    } else {
        callback(null, false)
        return callback(new BadRequestException('File type not acceptable'));
    }
    },
    limits: { fileSize: appConfig.upload.fileSize }
    
});






// multer setings

// product upload -> func export

// there might another file upload like profile photo function


// const { cloudinaryUploader } = require('../utils/cloudinary');
// const { ApplicationError } = require('../utils/appError');
// const { unlink } = require('fs').promises;

// module.exports.uploadToCloud = async (req, res, next) => {
//     const localPath = req.file.path;
//     try {
//         const image = await cloudinaryUploader(localPath);
//         if (!image) throw new ApplicationError('Internal server error');
//         req.image = image;
//         await unlink(localPath);
//         next();
//     } catch (error) {
//         await unlink(localPath);
//         next(error);
//     }
// };