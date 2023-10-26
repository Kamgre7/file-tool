import { PDFDocument, PageSizes } from 'pdf-lib';
import { injectable } from 'inversify';
import { UpdatedFiles } from '../fileTools/services/fileToolsService';
import path from 'path';
import { PdfHandlerError } from '../../errors/pdfHandlerError';

export type PdfFileData = {
  filename: string;
  content: Buffer;
};

export interface IPdfHandler {
  create(text: string): Promise<Buffer>;
  createMultiple(filesInfo: UpdatedFiles[]): Promise<PdfFileData[]>;
}
@injectable()
export class PdfHandler implements IPdfHandler {
  constructor() {}

  async create(text: string): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(PageSizes.A4);

      const { height } = page.getSize();
      const fontSize = 16;

      page.drawText(text, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
      });

      const pdfBytes = await pdfDoc.save();

      return Buffer.from(pdfBytes);
    } catch (err) {
      throw new PdfHandlerError(
        'An error occurred while generating the PDF file.'
      );
    }
  }

  async createMultiple(filesInfo: UpdatedFiles[]): Promise<PdfFileData[]> {
    try {
      return await Promise.all(
        filesInfo.map(async ({ content, filename }) => ({
          filename: `${path.parse(filename).name}.pdf`,
          content: await this.create(content),
        }))
      );
    } catch (err) {
      throw new PdfHandlerError(
        'An error occurred while generating the PDF file.'
      );
    }
  }
}
