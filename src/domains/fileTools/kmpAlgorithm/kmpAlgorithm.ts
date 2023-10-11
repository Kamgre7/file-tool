import { injectable } from 'inversify';
import { Mode } from '../const';

export interface IKmpAlgorithm {
  longestPrefixSuffixArr(pattern: string): number[];
  kmpSearchAndReplace(
    text: string,
    pattern: string,
    replacement: string,
    mode?: Mode
  ): string;
}

@injectable()
export class KmpAlgorithm implements IKmpAlgorithm {
  constructor() {}

  longestPrefixSuffixArr(str: string): number[] {
    const table = new Array<number>(str.length);

    let maxPrefix = 0;
    table[0] = 0;

    for (let i = 1; i < str.length; i++) {
      while (maxPrefix > 0 && str.charAt(i) !== str.charAt(maxPrefix)) {
        maxPrefix = table[maxPrefix - 1];
      }
      if (str.charAt(maxPrefix) === str.charAt(i)) {
        maxPrefix++;
      }
      table[i] = maxPrefix;
    }

    return table;
  }

  kmpSearchAndReplace(
    text: string,
    pattern: string,
    replacement: string,
    mode: Mode = Mode.ALL
  ): string {
    const lps = this.longestPrefixSuffixArr(pattern);
    const result: string[] = [];
    let i = 0;
    let j = 0;
    //let found = false;

    while (i < text.length) {
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        /*  if (mode === Mode.FIRST && !found) {
          result.push(replacement);
          found = true;
          j = lps[j - 1];
          console.log('1');
        } else if (mode !== Mode.FIRST) {
          console.log('2');
          result.push(replacement);
          j = lps[j - 1];
        } else {
          console.log('3');

          result.push(pattern);
          j = lps[j - 1];
        } */

        /*  if (mode === Mode.FIRST) {
          result.push(replacement);
          j = 0;
        } else {
          result.push(replacement);
          j = lps[j - 1];
        } */
        result.push(replacement);
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          result.push(text[i]);
          i++;
        }
      }
    }

    while (i < text.length) {
      result.push(text[i]);
      i++;
    }

    return result.join('');
  }
}

/*  kmpMatching(str: string, pattern: string): number[] {
    const prefixes = this.longestPrefixSuffixArr(pattern);
    const matches: number[] = [];

    let j = 0;
    let i = 0;

    while (i < str.length) {
      if (str.charAt(i) === pattern.charAt(j)) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        matches.push(i - j);
        j = prefixes[j - 1];
      } else if (str.charAt(i) !== pattern.charAt(j)) {
        if (j !== 0) {
          j = prefixes[j - 1];
        } else {
          i++;
        }
      }
    }

    return matches;
  } */
