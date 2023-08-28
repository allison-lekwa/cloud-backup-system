import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, ValidateNested } from 'class-validator';

export class UserRequestUploadDto {
  @IsOptional()
  file?: Express.Multer.File[];
}

export class BulkUserRequestUploadDto extends UserRequestUploadDto {
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => UserRequestUploadDto)
  @ValidateNested()
  files: UserRequestUploadDto[];
}
