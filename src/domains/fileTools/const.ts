import { EditFileReq } from './schemas/editFileSchema';

export enum Mode {
  FIRST = 'first',
  ALL = 'all',
  LINE = 'line',
}

export type EditParams = EditFileReq['params'];
