import { AuthRoutes } from './route/auth';
import { FilesRoutes } from './route/file';

export const Routes = [
  ...FilesRoutes,
  ...AuthRoutes,
  
];
