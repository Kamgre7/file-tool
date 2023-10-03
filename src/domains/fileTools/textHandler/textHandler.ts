import 'reflect-metadata';
import { injectable } from 'inversify';
import { EditParams, Mode } from '../const';
import { BadRequestError } from '../../../errors/badRequestError';

export interface ITextHandler {
  countPhrases(text: string, params: EditParams): number;
  getLineOfText(text: string, line: number): string;
  splitByLines(text: string): string[];
}

@injectable()
export class TextHandler implements ITextHandler {
  constructor() {}

  countPhrases(text: string, params: EditParams): number {
    this.validateIfNotFirstMode(params.mode);

    const phraseToFind = new RegExp(params.phrase, 'gi');

    const content =
      params.mode === Mode.LINE ? this.getLineOfText(text, params.line!) : text;

    const counter = content.match(phraseToFind);

    return counter ? counter.length : 0;
  }

  getLineOfText(text: string, line: number): string {
    const textByLine = this.splitByLines(text);

    if (textByLine.length < line) {
      throw new BadRequestError('Invalid line');
    }

    return textByLine[line - 1];
  }

  splitByLines(text: string): string[] {
    return text.split('\n');
  }

  private validateIfNotFirstMode(mode: Mode): void {
    if (mode === Mode.FIRST) {
      throw new BadRequestError('Invalid mode');
    }
  }
}
