import { injectable } from 'inversify';
import { MODE, ModeType } from '../../fileTools/types/modeType';

export interface IKmpAlgorithm {
  searchAndReplace(
    text: string,
    pattern: string,
    replacement: string,
    mode?: ModeType
  ): string;
  count(text: string, pattern: string): number;
}

@injectable()
export class KmpAlgorithm implements IKmpAlgorithm {
  constructor() {}

  private longestPrefixSuffixArr(pattern: string): number[] {
    const table = new Array<number>(pattern.length);

    let maxPrefix = 0;
    table[0] = 0;

    for (let i = 1; i < pattern.length; i++) {
      while (maxPrefix > 0 && pattern.charAt(i) !== pattern.charAt(maxPrefix)) {
        maxPrefix = table[maxPrefix - 1];
      }

      if (pattern.charAt(maxPrefix) === pattern.charAt(i)) {
        maxPrefix++;
      }

      table[i] = maxPrefix;
    }

    return table;
  }

  searchAndReplace(
    text: string,
    pattern: string,
    replacement: string,
    mode: ModeType = MODE.ALL
  ): string {
    const lps = this.longestPrefixSuffixArr(pattern.toLowerCase());
    const result: string[] = [];
    let i = 0;
    let j = 0;
    let found = false;

    while (i < text.length) {
      if (pattern[j].toLowerCase() === text[i].toLowerCase()) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        if (mode === MODE.FIRST && !found) {
          result.push(replacement);
          found = true;
        } else if (mode !== MODE.FIRST) {
          result.push(replacement);
        } else {
          result.push(text.slice(i - j, i));
        }

        j = lps[j - 1];
      } else if (
        i < text.length &&
        pattern[j].toLowerCase() !== text[i].toLowerCase()
      ) {
        if (j !== 0) {
          result.push(text.slice(i - j, i));
          j = lps[j - 1];
        } else {
          result.push(text[i]);
          i++;
        }
      }
    }

    return result.join('');
  }

  count(text: string, pattern: string): number {
    const lps = this.longestPrefixSuffixArr(pattern);
    const matches = [];

    let j = 0;
    let i = 0;

    while (i < text.length) {
      if (pattern[j].toLowerCase() === text[i].toLowerCase()) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        matches.push(i - j);

        j = lps[j - 1];
      } else if (
        i < text.length &&
        pattern[j].toLowerCase() !== text[i].toLowerCase()
      ) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }

    return matches.length;
  }
}
