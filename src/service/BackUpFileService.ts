import { NotAcceptableException } from "../common/helper/throw-error";
import { BulkUserRequestUploadDto, UserRequestUploadDto } from "../dto/user-request-upload.dto";
import { S3FileService } from "./S3FileService";
import { S3FilePrivacy } from "../common/interface";

export class BackUpFileService {
  private s3FileService = new S3FileService();

  async uploadUserRequestFiles(
    dto: BulkUserRequestUploadDto,
    files?: Express.Multer.File[],
  ) {
    console.log(files);
    
    if (!files.length) {
      throw new NotAcceptableException('File not uploaded ');
    }
    for(let file of files) {
      const uploadResult = await this.s3FileService.uploadFile({
        imageBuffer: file.buffer,
        privacy: S3FilePrivacy.PUBLIC_READ,
      });
      return {
        url: uploadResult.Location,
        key: uploadResult.Key,
        eTag: uploadResult.ETag,
        bucket: uploadResult.Bucket,
      };
    }
    
  }
}