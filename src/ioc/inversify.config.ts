import { Container } from 'inversify';
import {
  FileToolsController,
  IFileToolsController,
} from '../domains/fileTools/controllers/fileToolsController';
import {
  FileToolsService,
  IFileToolsService,
} from '../domains/fileTools/services/fileToolsService';
import {
  IKmpAlgorithm,
  KmpAlgorithm,
} from '../domains/textHandler/kmpAlgorithm/kmpAlgorithm';
import { IZipHandler, ZipHandler } from '../domains/zipHandler/zipHandler';
import { TYPES } from './types/types';
import { ITextHandler, TextHandler } from '../domains/textHandler/textHandler';
import { IPdfHandler, PdfHandler } from '../domains/pdfHandler/pdfHandler';

export const container = new Container();

// FileTools
container
  .bind<IFileToolsController>(TYPES.FileToolsControllerToken)
  .to(FileToolsController);

container
  .bind<IFileToolsService>(TYPES.FileToolsServiceToken)
  .to(FileToolsService);

// TextHandler
container.bind<ITextHandler>(TYPES.TextHandlerToken).to(TextHandler);

// KMP algorithm
container.bind<IKmpAlgorithm>(TYPES.KmpAlgorithmToken).to(KmpAlgorithm);

// zipFiles
container.bind<IZipHandler>(TYPES.ZipHandlerToken).to(ZipHandler);

//pdf creator
container.bind<IPdfHandler>(TYPES.PdfHandlerToken).to(PdfHandler);
