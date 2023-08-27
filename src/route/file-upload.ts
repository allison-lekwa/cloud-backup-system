import { UserController } from "../controller/UserController";
import { authorizeAccess } from "../common/middlewares/authenticate";
import { multerUpload } from "../common/helper/multer";

export const UploadRoutes = [
  {
    method: 'post',
    route: '/upload/files',
    controller: UserController,
    action: 'uploadfiles',
    middleware: authorizeAccess,
    validation: multerUpload.array('files')
  },
];
