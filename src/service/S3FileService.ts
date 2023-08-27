import { AppUtilities } from '@@/app.utilities';
import { S3 } from 'aws-sdk';
import { UploadFileDto } from '../dto/upload-file.dto';
import { CreateFileDto } from '../dto/create-file.dto';
import { NotFoundException } from '../common/helper/throw-error';
import appConfig from '../app.config';
import { File } from '../common/database/prisma-client-manager';

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
      })
      .promise();

    return uploadResult || null;
  }

  //Access files in AWS
  public async getPrivateFile(key: string) {
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
  public async getPrivateFileBuffer(key: string) {
    const stream = await this.s3Sdk
      .getObject({
        Bucket: this.S3Bucket,
        Key: key,
      })
      .createReadStream();
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', reject);
    });
  }

  public async getPrivateFileBase64(objectKey) {
    try {
      const params = {
        Bucket: this.S3Bucket,
        Key: objectKey,
      };
      const data = await this.s3Sdk.getObject(params).promise();
      // Check for image payload and formats appropriately
      return { body: data.Body.toString('base64'), type: data.ContentType };
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  public async getPrivateFile2(objectKey) {
    try {
      const params = {
        Bucket: this.S3Bucket,
        Key: objectKey,
      };
      const data = await this.s3Sdk.getObject(params).promise();
      // Check for image payload and formats appropriately
      return data.Body.toString('base64');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
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

  public async generatePresignedUrl(key: string) {
    return this.s3Sdk.getSignedUrlPromise('getObject', {
      Bucket: this.S3Bucket,
      Key: key,
    });
  }

  public async getPrivateFileUrl(key: string) {
    try {
      const params = {
        Bucket: this.S3Bucket,
        Key: key,
      };
      const url = await this.s3Sdk.getSignedUrl('getObject', params);
      return url;
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }
}