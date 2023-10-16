import { z } from 'zod';
import { FileSchema } from './fileSchema';
import { MODE } from '../types/modeType';

export const DeletePhraseQuerySchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal(MODE.LINE),
    line: z.coerce.number().int().min(1),
  }),
  z.object({
    mode: z.enum([MODE.FIRST, MODE.ALL]),
  }),
]);

export const DeletePhraseBodySchema = z.object({
  phrase: z.string().min(1),
});

export const DeletePhraseSchema = z.object({
  query: DeletePhraseQuerySchema,
  file: FileSchema,
  body: DeletePhraseBodySchema,
});

export type DeletePhraseQuery = z.infer<typeof DeletePhraseQuerySchema>;
export type DeletePhraseBody = z.infer<typeof DeletePhraseBodySchema>;
export type DeletePhraseReq = z.infer<typeof DeletePhraseSchema>;
