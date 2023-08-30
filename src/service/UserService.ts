import { CreateUserDto } from '../dto/create-user-dto';
import { User } from '../common/database/prisma-client-manager'
import { AppUtilities } from '../app.utilities';
import { GetUserByEmailDto, GetUserById } from '../dto/get-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import cacheClient from '../common/helper/cache-client';
import { JwtPayload, JwtRefreshTokenPayload } from '../common/interface';
import appConfig from '../app.config';
import { generateAccessToken, generateRefreshToken } from '../common/middlewares/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { IdsDto } from '../dto/ids.dto';
import { CreateFileDirDto } from '../dto/create-file-dir.dto';
import fs from "fs";
import path from "path";
import { BadRequestException } from '../common/helper/throw-error';
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

  async getUserByEmail({ email }: GetUserByEmailDto) {
    return await User.findUnique({
        where: {
            email
        },
        include: {
          hashedPassword: true,
        }
    });
  };

  async getUserById({ id }: GetUserById) {
    return await User.findUnique({
        where: {
            id
        }
    });
  };

  async signIn({ email, password }: SignInDto) {
    const  user = await this.getUserByEmail({email});
    
    if (
      !user ||
      !(await AppUtilities.validatePassword(password, user.hashedPassword.password))
    ) {
      throw new Error('Invalid credentials')
    }

    const accessToken = await generateAccessToken({email: user.email, userId: user.id, isAdmin:user.isAdmin});
    const refreshToken = await generateRefreshToken({email: user.email, userId: user.id, isAdmin:user.isAdmin});
    
    await this.setUserRefreshToken({email, refreshToken});
    
    return {
      accessToken, refreshToken
    }
};

async updateUserPassword (dto: UpdatePasswordDto) {
  const hashedPassword = await AppUtilities.hashAuthSecret(dto.newPassword);
    return User.update({
        where: {
            id: dto.id
        },
        data: {
            hashedPassword: {
              update: {
                password: hashedPassword,
              }
            }
        }
    });
};

async getAllUsers() {
  return await User.findMany();
}

// Refresh token
async setUserRefreshToken(dto: JwtRefreshTokenPayload) {
  const reddisRefreshExpires = appConfig.redis.cacheTtl
  await cacheClient.set(dto.email, JSON.stringify(dto.refreshToken), { EX: reddisRefreshExpires });
};

async createDirFile({name}: CreateFileDirDto, user: JwtPayload) {
  // create a new directory 'assets' in the root directory
  const folderPath = `./${name}`;

  if (fs.existsSync(folderPath)) {
    throw new BadRequestException('Folder name already exist')
  }
  fs.mkdirSync(folderPath);

  await User.update({
    where: { id: user.userId },
    data: {
      directory: {
        upsert: {
            where: {
              userId: user.userId
            },
            
            create: {
              name,
              createdBy: user.userId,
            },
            update: {
              name,
              updatedBy: user.userId,
            },
        }
      }
    }
  })
  return 'File directory created successfully'
}

async makeUserAdmin({ids}: IdsDto, user: JwtPayload) {
  const users = await User.updateMany({
    where: { id: { in: ids } },
    data: { isAdmin: true, updatedBy: user.userId}
  })
  return users.count;
}

// JWT refresh ttl === refresh redis ttl and verfication token and redis key ttl
// SignUp
// async setUserSignUpCache(dto: JwtPayload) {
//     const reddisExpires = appConfig.redis.cacheTtl;
//     await cacheClient.set(dto.email, JSON.stringify(dto), { EX: reddisExpires });
// };

// async getUserSignUpCache({ email }: GetUserByEmailDto) {
//     return JSON.parse(await cacheClient.get(email));
// };

// async deleteUserSignUpCache({ email }: GetUserByEmailDto) {
//     await cacheClient.del(email);
// };


async getUserRefreshToken({ email }: GetUserByEmailDto) {
    return await cacheClient.get(email);
};

async deleteUserRefreshToken({ email }: GetUserByEmailDto) {
    await cacheClient.del(email);
};

}
