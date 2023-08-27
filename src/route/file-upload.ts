import { UserController } from "../controller/UserController";
import { authorizeAccess } from "../common/middlewares/authenticate";
import { fileFilter, fileStorage } from "../common/helper/multer";
import multer from "multer";
import appConfig from "../app.config";

export const UploadRoutes = [
  {
    method: 'post',
    route: '/upload/files',
    controller: UserController,
    action: 'uploadfiles',
    middleware: authorizeAccess,
    validation: multer({storage: fileStorage, fileFilter: fileFilter, limits: { fileSize: appConfig.upload.fileSize } }).array('files', 5)
  },
];
