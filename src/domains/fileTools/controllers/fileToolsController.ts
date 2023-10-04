import 'reflect-metadata';
import { Request, Response } from 'express';
import { EditFileSchema } from '../schemas/editFileSchema';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/types';
import { IFileToolsService } from '../services/fileToolsService';
import { UpdateFileSchema } from '../schemas/updateFileSchema';

export interface IFileToolsController {
  findPhrase(req: Request, res: Response): Promise<void>;
  deletePhrase(req: Request, res: Response): Promise<void>;
  updatePhrase(req: Request, res: Response): Promise<void>;
}
@injectable()
export class FileToolsController implements IFileToolsController {
  constructor(
    @inject(TYPES.IFileToolsService)
    private readonly fileToolsService: IFileToolsService
  ) {}

  findPhrase = async (req: Request, res: Response): Promise<void> => {
    const { params, file } = EditFileSchema.parse(req);

    const phrasesCounter = this.fileToolsService.countPhrases(params, file);

    res.status(200).json({
      foundPhrases: phrasesCounter,
    });
  };

  deletePhrase = async (req: Request, res: Response): Promise<void> => {
    const { params, file } = EditFileSchema.parse(req);

    const text = this.fileToolsService.deletePhrases(params, file);

    res.status(200).json({
      status: 'success',
      text,
    });
  };

  updatePhrase = async (req: Request, res: Response): Promise<void> => {
    const { params, file, body } = UpdateFileSchema.parse(req);

    const text = this.fileToolsService.updatePhrases(
      params,
      file,
      body.updatedPhrase
    );

    res.status(200).json({
      status: 'success',
      text,
    });
  };
}
