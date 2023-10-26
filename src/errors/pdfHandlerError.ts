import { AppError } from './appError';

export class PdfHandlerError extends AppError {
  constructor(message: string, code: number = 500) {
    super(message, code);
  }
}
