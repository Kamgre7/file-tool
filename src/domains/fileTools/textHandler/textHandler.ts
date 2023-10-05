import 'reflect-metadata';
import { injectable } from 'inversify';
import { EditParams, Mode } from '../const';
import { BadRequestError } from '../../../errors/badRequestError';
import { regExpPatterns } from '../utils/utils';

export interface ITextHandler {
  update(text: string, params: EditParams, newPhrase: string): string;
  delete(text: string, params: EditParams): string;
  countPhrases(text: string, params: EditParams): number;
  getLineOfText(text: string, line: number): string;
  splitByLines(text: string): string[];
}

@injectable()
export class TextHandler implements ITextHandler {
  constructor() {}

  update(text: string, params: EditParams, newPhrase: string): string {
    const flags = params.mode === Mode.FIRST ? 'i' : 'gi';

    const regExp = new RegExp(`\\b${params.phrase}\\b`, flags);

    if (params.mode === Mode.LINE) {
      const textByLines = this.splitByLines(text);

      this.validateIfTextLinesGraterThanLine(textByLines.length, params.line!);

      const textToChange = textByLines[params.line! - 1];

      textByLines[params.line! - 1] = textToChange.replace(regExp, newPhrase);

      return textByLines.join('\n');
    }

    return text.replace(regExp, newPhrase);
  }

  delete(text: string, params: EditParams): string {
    const content = this.update(text, params, '');

    return content.replace(regExpPatterns.removeMultipleSpaces, '');
  }

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

    this.validateIfTextLinesGraterThanLine(textByLine.length, line);

    return textByLine[line - 1];
  }

  splitByLines(text: string): string[] {
    return text.split('\n');
  }

  private validateIfTextLinesGraterThanLine(
    textLines: number,
    line: number
  ): void {
    if (textLines < line) {
      throw new BadRequestError('Invalid line');
    }
  }

  private validateIfNotFirstMode(mode: Mode): void {
    if (mode === Mode.FIRST) {
      throw new BadRequestError('Invalid mode');
    }
  }
}
