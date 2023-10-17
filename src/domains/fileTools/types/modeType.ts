export const MODE = {
  FIRST: 'first',
  ALL: 'all',
  LINE: 'line',
} as const;

export type ModeType = (typeof MODE)[keyof typeof MODE];
