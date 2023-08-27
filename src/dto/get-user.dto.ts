import { IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export  class GetUserByEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export  class GetUserById {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}