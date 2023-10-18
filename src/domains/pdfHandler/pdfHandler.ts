import 'reflect-metadata';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { injectable } from 'inversify';

export interface IPdfHandler {
  create(text: string): Promise<Buffer>;
}
@injectable()
export class PdfHandler implements IPdfHandler {
  constructor() {}

  async create(text: string): Promise<Buffer> {
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
  }
}
