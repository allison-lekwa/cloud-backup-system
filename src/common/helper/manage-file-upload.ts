import { NextFunction } from "express";
import { RequestWithUser } from "../interface";
import { multerUpload } from "./multer";
import { BadRequestException } from "./throw-error";
import { S3FileService } from "../../service/S3FileService";

const fileService = S3FileService

// export const localUpload = (req: RequestWithUser, res: any, next: NextFunction) => {
//     multerUpload(req, res, (error) => {
//         if (error) {
//             if (error.code === 'LIMIT_FILE_SIZE') {
//                 return next(new BadRequestException('File too large'));
//             }
//             next(error);
//         } 
//         if (!req.file) {
//           next(new BadRequestException('You must provide a file'));
//         }
//         next();
//     });
// };
