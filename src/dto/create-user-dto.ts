import { IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export  class CreateUserDto {
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsBooleanString()
  isAdmin?: boolean
};
