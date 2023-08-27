import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../common/interface';
import { BulkUserRequestUploadDto } from '../dto/user-request-upload.dto';
import { BackUpFileService } from '../service/BackUpFileService';

export class BackUpFileController {
  private fileService = new BackUpFileService();

  async uploadfiles(request: RequestWithUser, response: Response, next: NextFunction) {
    const dto: BulkUserRequestUploadDto = request.body.files;
    try {
      console.log(dto, '..........');
      
      const user = await this.fileService.uploadUserRequestFiles(dto);
    
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

}
