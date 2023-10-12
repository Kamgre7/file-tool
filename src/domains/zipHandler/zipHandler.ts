import AdmZip from 'adm-zip';
import { injectable } from 'inversify';

export type UnzipFileInfo = {
  originalName: string;
  buffer: Buffer;
};

export interface IZipHandler {
  getFilesInformation(data: Buffer): UnzipFileInfo[];
}

@injectable()
export class ZipHandler implements IZipHandler {
  constructor() {}

  getFilesInformation(data: Buffer): UnzipFileInfo[] {
    const zip = new AdmZip(data);
    const entries = zip.getEntries();

    return entries.map((file) => ({
      originalName: file.name,
      buffer: file.getData(),
    }));
  }
}

export const zipHandler = new ZipHandler();
