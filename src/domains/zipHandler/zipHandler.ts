import { injectable } from 'inversify';
import JSZip from 'jszip';
import { PdfFileData } from '../pdfHandler/pdfHandler';

export type UnzipFilesInfo = {
  originalName: string;
  content: string;
};

export interface IZipHandler {
  create(filesData: PdfFileData[]): Promise<Buffer>;
  getFilesInformation(data: Buffer): Promise<UnzipFilesInfo[]>;
}

@injectable()
export class ZipHandler implements IZipHandler {
  constructor() {}

  async getFilesInformation(data: Buffer): Promise<UnzipFilesInfo[]> {
    const zip = new JSZip();
    await zip.loadAsync(data);

    return await Promise.all(
      Object.entries(zip.files).map(async ([entryName, file]) => {
        const content = await file.async('text');

        return {
          originalName: entryName,
          content,
        };
      })
    );
  }

  async create(filesData: PdfFileData[]): Promise<Buffer> {
    const zip = new JSZip();

    filesData.forEach(({ content, filename }) => {
      zip.file(filename, content);
    });

    return await zip.generateAsync({
      type: 'nodebuffer',
    });
  }
}

export const zipHandler = new ZipHandler();
