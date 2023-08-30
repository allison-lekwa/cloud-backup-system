import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDirDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
