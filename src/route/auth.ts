// import { UserController } from '../controller/UserController';
// import { authenticate } from '../middleware/authenticate';
// import { changePasswordValidation } from '../validation/change-password-validation';
// import { createUserValidation } from '../validation/create-user-validation';

import { Body } from "../common/middlewares/validator";
import { UserController } from "../controller/UserController";
import { CreateUserDto } from "../dto/create-user-dto";

export const AuthRoutes = [
  {
    method: 'post',
    route: '/auth/register',
    controller: UserController,
    action: 'register',
    middleware: null,
    validation: Body(CreateUserDto)
  },
];
