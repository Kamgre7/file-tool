import { Container } from 'inversify';
import {
  FileToolsController,
  IFileToolsController,
} from '../domains/fileTools/controllers/fileToolsController';
import { TYPES } from '../domains/types/types';
import {
  FileToolsService,
  IFileToolsService,
} from '../domains/fileTools/services/fileToolsService';
import {
  TextHandler,
  ITextHandler,
} from '../domains/fileTools/textHandler/textHandler';
import {
  IKmpAlgorithm,
  KmpAlgorithm,
} from '../domains/fileTools/kmpAlgorithm/kmpAlgorithm';
import { IZipHandler, ZipHandler } from '../domains/zipHandler/zipHandler';

export const container = new Container();

// FileTools
container
  .bind<IFileToolsController>(TYPES.IFileToolsController)
  .to(FileToolsController);

container.bind<IFileToolsService>(TYPES.IFileToolsService).to(FileToolsService);

// TextHandler
container.bind<ITextHandler>(TYPES.ITextHandler).to(TextHandler);

// KMP algorithm
container.bind<IKmpAlgorithm>(TYPES.IKmpAlgorithm).to(KmpAlgorithm);

// zipFiles
container.bind<IZipHandler>(TYPES.IZipHandler).to(ZipHandler);
