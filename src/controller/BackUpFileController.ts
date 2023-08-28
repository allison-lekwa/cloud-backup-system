import { NextFunction, Response } from 'express';
import { JwtPayload, RequestWithUser } from '../common/interface';
import { BackUpFileService } from '../service/BackUpFileService';
import { IdsDto } from '@@/dto/ids.dto';

export class BackUpFileController {
  private fileService = new BackUpFileService();

  async uploadFiles(request: RequestWithUser, response: Response, next: NextFunction) {
    const dto: any = request.files;
    const user: JwtPayload = request.user;
    try {      
      const count = await this.fileService.uploadUserRequestFiles(dto, user);
    
      return response.status(201).json(`${count} files backed up successfully!!!`);
    } catch (error) {
      next(error);
    }
  }

  async findAllFiles(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const result = await this.fileService.getAllFiles();

      res.status(200)
        .json({
          success: true,
          result: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async markAsUnsafeFiles(req: RequestWithUser, res: Response, next: NextFunction) {
    const dto: IdsDto = req.body;
    
    try {
      
      const result = await this.fileService.markAsUnsafe(dto);

      res.status(200)
        .json({
          success: true,
          message: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async downloadFiles(req: RequestWithUser, res: Response, next: NextFunction) {
    const dto: IdsDto = req.body;
    
    try {
      
      const count = await this.fileService.downloadBackupFiles(dto);
    
      return res.status(201).json(`${count} files backed up successfully!!!`);
    } catch (error) {
      next(error);
    }
  }


}
