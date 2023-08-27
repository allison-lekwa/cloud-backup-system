import { SignInDto } from "../dto/sign-in.dto";
import { Body } from "../common/middlewares/validator";
import { UserController } from "../controller/UserController";
import { CreateUserDto } from "../dto/create-user-dto";
import { authorizeAccess, authorizeRefresh } from "../common/middlewares/authenticate";

export const AuthRoutes = [
  {
    method: 'post',
    route: '/auth/register',
    controller: UserController,
    action: 'register',
    middleware: authorizeAccess,
    validation: Body(CreateUserDto)
  },

  {
    method: 'post',
    route: '/auth/login',
    controller: UserController,
    action: 'login',
    middleware: null,
    validation: Body(SignInDto),
  },

  {
    method: 'delete',
    route: '/auth/logout',
    controller: UserController,
    action: 'logout',
    middleware: authorizeRefresh,
    validation: null,
  },
];
