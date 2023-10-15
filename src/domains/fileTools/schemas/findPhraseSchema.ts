import { z } from 'zod';
import { FileSchema } from './fileSchema';
import { MODE } from '../types/modeType';

export const FindPhraseQuerySchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal(MODE.LINE),
    line: z.coerce.number().int().min(1),
  }),
  z.object({
    mode: z.literal(MODE.ALL),
  }),
]);

export const FindPhraseBodySchema = z.object({
  phrase: z.string().min(1),
});

export const FindPhraseSchema = z.object({
  query: FindPhraseQuerySchema,
  body: FindPhraseBodySchema,
  file: FileSchema,
});

export type FindPhraseQuery = z.infer<typeof FindPhraseQuerySchema>;
export type FindPhraseBody = z.infer<typeof FindPhraseBodySchema>;
export type FindPhraseReq = z.infer<typeof FindPhraseSchema>;
