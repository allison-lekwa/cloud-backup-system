import { SignInDto } from "../dto/sign-in.dto";
import { Body } from "../common/middlewares/validator";
import { UserController } from "../controller/UserController";
import { CreateUserDto } from "../dto/create-user-dto";
import { authorizeAccess, authorizeRefresh } from "../common/middlewares/authenticate";
import { IdsDto } from "../dto/ids.dto";

export const AuthRoutes = [
  {
    method: 'post',
    route: '/auth/register',
    controller: UserController,
    action: 'registerR',
    middleware: null,
    isAdminMiddleware: null,
    validation: Body(CreateUserDto)
  },

  {
    method: 'post',
    route: '/auth/login',
    controller: UserController,
    action: 'login',
    middleware: null,
    isAdminMiddleware: null,
    validation: Body(SignInDto),
  },

  {
    method: 'delete',
    route: '/auth/logout',
    controller: UserController,
    action: 'logout',
    middleware: authorizeRefresh,
    isAdminMiddleware: null,
    validation: null,
  },

  {
    method: 'get',
    route: '/auth/users',
    controller: UserController,
    action: 'findAllUsers',
    middleware: authorizeAccess,
    isAdminMiddleware: null,
    validation: null,
  },

  {
    method: 'patch',
    route: '/auth/make-users-admin',
    controller: UserController,
    action: 'makeUsersAdmin',
    middleware: authorizeAccess,
    isAdminMiddleware: null,
    validation: Body(IdsDto),
  },
];
