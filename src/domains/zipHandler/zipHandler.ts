import { injectable } from 'inversify';
import JSZip from 'jszip';

export type UnzipFilesInfo = {
  originalName: string;
  content: string;
};

export interface IZipHandler {
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
}

export const zipHandler = new ZipHandler();
