import { z } from 'zod';
import { ModeWithoutFirst } from '../const';
import { FileSchema } from './fileSchema';

export const FindPhraseQuerySchema = z
  .object({
    mode: z.nativeEnum(ModeWithoutFirst),
    line: z.optional(z.coerce.number().int().min(1)),
  })
  .refine((value) => {
    if (value.mode === ModeWithoutFirst.LINE) {
      return typeof value.line === 'number';
    }

    return true;
  });

export const FindPhraseBodySchema = z.object({
  phrase: z.string().min(2),
});

export const FindPhraseSchema = z.object({
  query: FindPhraseQuerySchema,
  body: FindPhraseBodySchema,
  file: FileSchema,
});

export type FindPhraseQuery = z.infer<typeof FindPhraseQuerySchema>;
export type FindPhraseBody = z.infer<typeof FindPhraseBodySchema>;
export type FindPhraseReq = z.infer<typeof FindPhraseSchema>;
