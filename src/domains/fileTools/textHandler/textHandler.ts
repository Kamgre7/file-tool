import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../errors/badRequestError';
import { FindPhraseQuery } from '../schemas/findPhraseSchema';
import { Mode, ModeWithoutFirst } from '../const';
import { IKmpAlgorithm } from '../kmpAlgorithm/kmpAlgorithm';
import { TYPES } from '../../types/types';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../schemas/updatePhraseSchema';
import { DeletePhraseQuery } from '../schemas/deletePhraseSchema';

export interface ITextHandler {
  update(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    text: string
  ): string;
  delete(phrase: string, query: DeletePhraseQuery, text: string): string;
  replaceByLine(
    text: string,
    line: number,
    currentPhrase: string,
    newPhrase: string
  ): string;
  countPhrases(phrase: string, query: FindPhraseQuery, text: string): number;
  getLineOfText(text: string, line: number): string;
  splitByLines(text: string): string[];
}

@injectable()
export class TextHandler implements ITextHandler {
  constructor(
    @inject(TYPES.IKmpAlgorithm)
    private readonly kmpAlgorithm: IKmpAlgorithm
  ) {}

  update(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    text: string
  ): string {
    const { mode, line } = query;
    const { currentPhrase, newPhrase } = phrasesInfo;

    return mode === Mode.LINE
      ? this.replaceByLine(text, line!, currentPhrase, newPhrase)
      : this.kmpAlgorithm.kmpSearchAndReplace(
          text,
          currentPhrase,
          newPhrase,
          mode
        );
  }

  delete(phrase: string, query: DeletePhraseQuery, text: string): string {
    const { mode, line } = query;

    return mode === Mode.LINE
      ? this.replaceByLine(text, line!, phrase, '')
      : this.kmpAlgorithm.kmpSearchAndReplace(text, phrase, '', mode);
  }

  countPhrases(phrase: string, query: FindPhraseQuery, text: string): number {
    const phraseToFind = new RegExp(`\\b${phrase}\\b`, 'gi');

    const content =
      query.mode === ModeWithoutFirst.LINE
        ? this.getLineOfText(text, query.line!)
        : text;

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

  replaceByLine(
    text: string,
    line: number,
    currentPhrase: string,
    newPhrase: string
  ): string {
    const textByLines = this.splitByLines(text);
    this.validateIfTextLinesGraterThanLine(textByLines.length, line);

    const textToChange = textByLines[line - 1];

    textByLines[line - 1] = this.kmpAlgorithm.kmpSearchAndReplace(
      textToChange,
      currentPhrase,
      newPhrase
    );

    return textByLines.join('\n');
  }

  private validateIfTextLinesGraterThanLine(
    textLines: number,
    line: number
  ): void {
    if (textLines < line) {
      throw new BadRequestError('Invalid line');
    }
  }
}
