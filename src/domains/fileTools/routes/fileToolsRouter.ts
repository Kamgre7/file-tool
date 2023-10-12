import 'reflect-metadata';
import { Router } from 'express';
import { FindPhraseSchema } from '../schemas/findPhraseSchema';
import multer from 'multer';
import { IFileToolsController } from '../controllers/fileToolsController';
import { storage, zipFileFilter } from '../../../config/multerConfig';
import { container } from '../../../ioc/inversify.config';
import { requestValidator } from '../../../middlewares/requestValidator';
import { TYPES } from '../../types/types';
import { UpdatePhraseSchema } from '../schemas/updatePhraseSchema';
import { DeletePhraseSchema } from '../schemas/deletePhraseSchema';

export const fileToolsRouter = Router();

const fileToolsController = container.get<IFileToolsController>(
  TYPES.IFileToolsController
);

fileToolsRouter
  .route('/')

  .get(
    multer({ storage }).single('file'),
    requestValidator(FindPhraseSchema),
    fileToolsController.findPhrase
  )

  .patch(
    multer({ storage }).single('file'),
    requestValidator(UpdatePhraseSchema),
    fileToolsController.updatePhrase
  )

  .delete(
    multer({ storage }).single('file'),
    requestValidator(DeletePhraseSchema),
    fileToolsController.deletePhrase
  );

fileToolsRouter
  .route('/zip')

  .get(
    multer({ storage, fileFilter: zipFileFilter }).single('file'),
    requestValidator(FindPhraseSchema),
    fileToolsController.findPhraseFromZip
  )

  .patch(
    multer({ storage, fileFilter: zipFileFilter }).single('file'),
    requestValidator(UpdatePhraseSchema),
    fileToolsController.updatePhraseFromZip
  )

  .delete(
    multer({ storage, fileFilter: zipFileFilter }).single('file'),
    requestValidator(DeletePhraseSchema),
    fileToolsController.deletePhraseFromZip
  );
