import { authorizeAccess, authorizeAdmin } from "../common/middlewares/authenticate";
import { fileFilter, fileMemoryStorage } from "../common/helper/multer";
import multer from "multer";
import appConfig from "../app.config";
import { BackUpFileController } from "../controller/BackUpFileController";
import { Body } from "../common/middlewares/validator";
import { IdsDto } from "../dto/ids.dto";

export const FilesRoutes = [
  {
    method: 'post',
    route: '/files/upload',
    controller: BackUpFileController,
    action: 'uploadFiles',
    middleware: authorizeAccess,
    isAdminMiddleware: null,
    validation: multer({storage: fileMemoryStorage, fileFilter: fileFilter, limits: { fileSize: appConfig.upload.fileSize } }).array('file', 5)
  },

  {
    method: 'post',
    route: '/files/download',
    controller: BackUpFileController,
    action: 'downloadFiles',
    middleware: null,
    isAdminMiddleware: null,
    validation: Body(IdsDto)
  },

  {
    method: 'get',
    route: '/files/get-all',
    controller: BackUpFileController,
    action: 'findAllFiles',
    middleware: authorizeAccess,
    isAdminMiddleware: null,
    validation: null,
  },

  {
    method: 'patch',
    route: '/files/mark-as-unsafe',
    controller: BackUpFileController,
    action: 'markAsUnsafeFiles',
    middleware: null,
    isAdminMiddleware: null,
    validation: Body(IdsDto),
  },
];
