import 'reflect-metadata';
import { Router } from 'express';
import { EditFileSchema } from '../schemas/editFileSchema';
import multer from 'multer';
import { IFileToolsController } from '../controllers/fileToolsController';
import { storage } from '../../../config/multerConfig';
import { container } from '../../../ioc/inversify.config';
import { requestValidator } from '../../../middlewares/requestValidator';
import { TYPES } from '../../types/types';

export const fileToolsRouter = Router();

const fileToolsController = container.get<IFileToolsController>(
  TYPES.IFileToolsController
);

fileToolsRouter
  .route('/:phrase/:mode/:line?')
  .get(
    multer({ storage }).single('file'),
    requestValidator(EditFileSchema),
    fileToolsController.findPhrase
  );
