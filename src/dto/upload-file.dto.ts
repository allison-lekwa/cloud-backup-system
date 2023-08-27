import { S3FilePrivacy } from '../common/interface';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsEnum(S3FilePrivacy)
  privacy?: S3FilePrivacy;

  @IsNotEmpty()
  imageBuffer: Buffer;
}
