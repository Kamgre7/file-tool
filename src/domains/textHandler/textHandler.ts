import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../errors/badRequestError';
import { FindPhraseQuery } from '../fileTools/schemas/findPhraseSchema';
import { IKmpAlgorithm } from './kmpAlgorithm/kmpAlgorithm';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../fileTools/schemas/updatePhraseSchema';
import { DeletePhraseQuery } from '../fileTools/schemas/deletePhraseSchema';
import { TYPES } from '../../ioc/types/types';
import { MODE } from '../fileTools/types/modeType';

export interface ITextHandler {
  update(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    text: string
  ): string;
  delete(phrase: string, query: DeletePhraseQuery, text: string): string;
  replaceByLine(
    text: string,
    currentPhrase: string,
    newPhrase: string,
    line: number
  ): string;
  countPhrases(phrase: string, query: FindPhraseQuery, text: string): number;
  getLineOfText(text: string, line: number): string;
  splitByLines(text: string): string[];
}

@injectable()
export class TextHandler implements ITextHandler {
  constructor(
    @inject(TYPES.KmpAlgorithmToken)
    private readonly kmpAlgorithm: IKmpAlgorithm
  ) {}

  update(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    text: string
  ): string {
    const { mode } = query;
    const { currentPhrase, newPhrase } = phrasesInfo;

    return mode === MODE.LINE
      ? this.replaceByLine(text, currentPhrase, newPhrase, query.line)
      : this.kmpAlgorithm.searchAndReplace(
          text,
          currentPhrase,
          newPhrase,
          mode
        );
  }

  delete(phrase: string, query: DeletePhraseQuery, text: string): string {
    const { mode } = query;

    return mode === MODE.LINE
      ? this.replaceByLine(text, phrase, '', query.line)
      : this.kmpAlgorithm.searchAndReplace(text, phrase, '', mode);
  }

  countPhrases(phrase: string, query: FindPhraseQuery, text: string): number {
    const { mode } = query;
    const phraseToFind = new RegExp(`\\b${phrase}\\b`, 'gi');

    const content =
      mode === MODE.LINE ? this.getLineOfText(text, query.line) : text;

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
    currentPhrase: string,
    newPhrase: string,
    line: number
  ): string {
    const textByLines = this.splitByLines(text);
    this.validateIfTextLinesGraterThanLine(textByLines.length, line);

    const textToChange = textByLines[line - 1];

    textByLines[line - 1] = this.kmpAlgorithm.searchAndReplace(
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
