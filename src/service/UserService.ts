import { CreateUserDto } from '../dto/create-user-dto';
import { User } from '../common/database/prisma-client-manager'
import { AppUtilities } from '../app.utilities';
export class UserService {

  async register({ password, ...createUserDto }: CreateUserDto) {
    const hashedPassword = await AppUtilities.hashAuthSecret(password);
    return await User.create({
      data: {
        ...createUserDto,
        hashedPassword: {
          create: {
            password: hashedPassword,
          }
        }

      }
    });
  }
}
