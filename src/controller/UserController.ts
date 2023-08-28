import { NextFunction, Response } from 'express';
import { UserService } from '../service/UserService';
import { CreateUserDto } from '../dto/create-user-dto';
import { SignInDto } from '../dto/sign-in.dto';
import { JwtPayload, RequestWithUser } from '../common/interface';
import { IdsDto } from '../dto/ids.dto';

export class UserController {
  private userService = new UserService();

  async register(request: RequestWithUser, response: Response, next: NextFunction) {
    const createUser: CreateUserDto = request.body;
    try {
      const user = await this.userService.register(createUser);
    
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: RequestWithUser, res: Response, next: NextFunction) {
    try {      
      const loginDto: SignInDto = req.body;
      const result = await this.userService.signIn(loginDto)
        
      res.status(200).json({
        success: true,
        message: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }
      });
    } catch (error) {
        next(error);
    }
  }

  async logout(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const { email } = req.user; 
        await this.userService.deleteUserRefreshToken({email});

        res.status(200)
          .json({
            success: true,
            message: `Logout finished for the email ${email}`
        })
    } catch (error) {
        next(error)
    }
  };

  async findAllUsers(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getAllUsers();

      res.status(200)
        .json({
          success: true,
          result: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async makeUsersAdmin(req: RequestWithUser, res: Response, next: NextFunction) {
    const dto: IdsDto = req.body;
    const user: JwtPayload = req.user;
    try {
      const result = await this.userService.makeUserAdmin(dto, user);

      res.status(200)
        .json({
          success: true,
          message: `${result} users have been made admin`
      })
    } catch (error) {
      next(error)
    }
  }

}
