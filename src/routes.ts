import { AuthRoutes } from './route/auth';
import { UploadRoutes } from './route/file-upload';

export const Routes = [
  ...AuthRoutes,
  ...UploadRoutes,
];
