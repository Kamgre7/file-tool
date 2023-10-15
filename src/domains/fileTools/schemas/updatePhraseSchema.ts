import { z } from 'zod';
import { FileSchema } from './fileSchema';
import { MODE } from '../types/modeType';

export const UpdatePhraseQuerySchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal(MODE.LINE),
    line: z.coerce.number().int().min(1),
  }),
  z.object({
    mode: z.union([z.literal(MODE.FIRST), z.literal(MODE.ALL)]),
  }),
]);

export const UpdatePhraseBodySchema = z.object({
  currentPhrase: z.string().min(1),
  newPhrase: z.string().min(1),
});

export const UpdatePhraseSchema = z.object({
  query: UpdatePhraseQuerySchema,
  file: FileSchema,
  body: UpdatePhraseBodySchema,
});

export type UpdatePhraseQuery = z.infer<typeof UpdatePhraseQuerySchema>;
export type UpdatePhraseBody = z.infer<typeof UpdatePhraseBodySchema>;
export type UpdatePhraseReq = z.infer<typeof UpdatePhraseSchema>;
