import 'reflect-metadata';
import { Request, Response } from 'express';
import { EditFileSchema } from '../schemas/editFileSchema';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/types';
import { IFileToolsService } from '../services/fileToolsService';

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

  deletePhrase = async (req: Request, res: Response): Promise<void> => {};

  updatePhrase = async (req: Request, res: Response): Promise<void> => {};
}
