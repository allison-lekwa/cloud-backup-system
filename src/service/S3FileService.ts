import { AppUtilities } from '../app.utilities';
import { S3 } from 'aws-sdk';
import { UploadFileDto } from '../dto/upload-file.dto';
import { NotFoundException } from '../common/helper/throw-error';
import appConfig from '../app.config';
import fs from "fs";
import path from "path";

export class S3FileService {
  private s3Sdk: S3;
  private S3Region: string;
  private S3Key: string;
  private S3Secret: string;
  private S3Bucket: string;

  constructor() {
    this.S3Region = appConfig.aws.S3Region;
    this.S3Key = appConfig.aws.S3Key;
    this.S3Secret = appConfig.aws.S3Secret;
    this.S3Bucket = appConfig.aws.S3Bucket;

    this.s3Sdk = new S3({
      accessKeyId: this.S3Key,
      secretAccessKey: this.S3Secret,
      region: this.S3Region,
    });
  }

  async uploadFile(data: UploadFileDto) {
    const uploadResult = await this.s3Sdk
      .upload({
        ACL: data.privacy,
        Bucket: this.S3Bucket,
        Body: data.imageBuffer,
        Key: AppUtilities.generateUniqueKey(),
        ContentType: `application/${data.dataType}`
      })
      .promise();

    return uploadResult || null;
  }

  //Access files in AWS
  public async downloadFile(key: string) {
    const stream = await this.s3Sdk
      .getObject({
        Bucket: this.S3Bucket,
        Key: key,
      })
      .createReadStream();
    if (stream) {
      return {
        stream,
      };
    }
    throw new NotFoundException('File not found');
  }

  //Access files in AWS
  public async deletePrivateFile(key: string) {
    const params = {
      Bucket: this.S3Bucket,
      Key: key,
    };
    try {
      await this.s3Sdk.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await this.s3Sdk.deleteObject(params).promise();
        console.log('file deleted Successfully');
      } catch (err) {
        console.log('ERROR in file Deleting : ' + JSON.stringify(err));
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
      throw new NotFoundException('File not found');
    }
  }

}