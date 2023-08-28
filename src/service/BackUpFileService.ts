import { BadRequestException, NotAcceptableException, UnauthorizedException } from "../common/helper/throw-error";
import { S3FileService } from "./S3FileService";
import { JwtPayload, S3FilePrivacy } from "../common/interface";
import { File, FileDir } from "../common/database/prisma-client-manager";
import { IdsDto } from "@@/dto/ids.dto";
import fs from "fs";
import path from "path";

export class BackUpFileService {
  private s3FileService = new S3FileService();

  async uploadUserRequestFiles(
    files: any,
    user: JwtPayload,
  ) {
    
    if (files.length <= 0) {
      throw new NotAcceptableException('File not uploaded ');
    }
    const arr = []
    const savedFiles = files.map( async file =>  {
      const [_, dataType] = file.originalname.split('.') 
      const uploadResult = await this.s3FileService.uploadFile({
        imageBuffer: file.buffer,
        privacy: S3FilePrivacy.PUBLIC_READ,
        dataType
      });
      const saveFile = await File.create({
        data: {
          userId: user.userId,
          name: file.originalname,
          url: uploadResult.Location,
          key: uploadResult.Key,
          eTag: uploadResult.ETag,
          bucket: uploadResult.Bucket,
          createdBy: user.userId
        }
      })
      return saveFile;
    })
    return savedFiles.length;
    
  }

  async downloadBackupFiles(dto: IdsDto, user: JwtPayload) {
    const files = await File.findMany({
      where: { id: { in: dto.ids }, isSafe: true }
    });

    const fileFolder = await FileDir.findUnique({
      where: {
        userId: user.userId,
      }
    })

    if (!fs.existsSync(fileFolder.name)) {
      fs.mkdirSync(fileFolder.name);
    }

    files.forEach(async file => {
      const {stream} = await this.s3FileService.downloadFile(file.key);
      let download = fs.createWriteStream(`./${fileFolder.name}/${file.name}`);
      
      // const dataStream = Readable.from([stream])
        return new Promise((resolve, reject) => {
          stream
        .on('error', (error) => {
            return reject(error);
        })

        download.once('finish', () => {
          resolve()
        })
        stream.pipe(download);
      })
    })

    return files.length;
  }



  async getAllFiles() {
    return await File.findMany();
  }

  //Mark as unsafe
  async markAsUnsafe({ids: Ids}: IdsDto) {
    const files = await File.findMany({
      where: { id: { in: Ids }, isSafe: true }
    });
    if(files.length <= 0 && Ids.length > 0) {
      throw new BadRequestException('Selected files have been marked as unsafe or do not exists')
    }
    
    files.forEach(file => {
      if (!file.name.match(/\.(mp4|MPEG-4|mkv|png|jpg|jpeg)$/)) {
        
        throw new NotAcceptableException('Only videos and pictures can be marked as unsafe');
      }
    })
    await File.updateMany({
      where: { id: { in: Ids }, isSafe: true},
      data: {
        isSafe: false,
      }
    })
    return 'Files successfully marked as unsafe and will be deleted within an hour'
  }

  //Cron job handles this -> Check the cron folder in the common folder
  async autoDeleteUnsafeFiles() {
    const files = await File.findMany({
      where: { isSafe: false }
    });
    
    console.log('The following unsafe files are to be deleted', files);
    
    await File.deleteMany({
      where: { isSafe: false},
    })
    console.log('Done deleting unsafe files');
    
  }
}