import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export  class UpdatePasswordDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}