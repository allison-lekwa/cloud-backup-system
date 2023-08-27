import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/UserService';
import { CreateUserDto } from '../dto/create-user-dto';
// import { validationResult } from 'express-validator';
import { throwError } from '../common/helper/throw-error';
import { Body } from '@@/common/middlewares/validator';
// import { ERROR_CODE } from '../constant/ERROR_CODE';
// import { validationErrorMessage } from '../helper/validation-error-message';

export class UserController {
  private userService = new UserService();

  async register(request: Request, response: Response, next: NextFunction) {
    const createUser: CreateUserDto = request.body;
    try {
      const user = await this.userService.register(createUser);
    
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

}
