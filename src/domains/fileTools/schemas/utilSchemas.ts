import { Mode } from '../const';
import { EditFileParams } from './editFileSchema';

export const isBuffer = (value: unknown): value is Buffer =>
  value instanceof Buffer;

export const isInt = (value: string): boolean => !isNaN(parseInt(value));

export const isGraterThanZero = (value: string): boolean => parseInt(value) > 0;

export const checkLineParamsValue = (value: EditFileParams): boolean => {
  if (value.mode === Mode.LINE) {
    return (
      typeof value.line === 'string' &&
      isInt(value.line) &&
      isGraterThanZero(value.line)
    );
  }

  return true;
};

export const transformParams = (value: EditFileParams) => ({
  ...value,
  line: value.mode === Mode.LINE ? parseInt(value.line as string) : null,
});
