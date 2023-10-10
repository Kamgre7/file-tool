import { z } from 'zod';
import { Mode } from '../const';
import { FileSchema } from './fileSchema';
import { type } from 'os';

export const DeletePhraseQuerySchema = z
  .object({
    mode: z.nativeEnum(Mode),
    line: z.optional(z.coerce.number().int().min(1)),
  })
  .refine((value) => {
    if (value.mode === Mode.LINE) {
      return typeof value.line === 'number';
    }

    return true;
  });

export const DeletePhraseBodySchema = z.object({
  phrase: z.string().min(2),
});

export const DeletePhraseSchema = z.object({
  query: DeletePhraseQuerySchema,
  file: FileSchema,
  body: DeletePhraseBodySchema,
});

export type DeletePhraseQuery = z.infer<typeof DeletePhraseQuerySchema>;
export type DeletePhraseBody = z.infer<typeof DeletePhraseBodySchema>;
export type DeletePhraseReq = z.infer<typeof DeletePhraseSchema>;
