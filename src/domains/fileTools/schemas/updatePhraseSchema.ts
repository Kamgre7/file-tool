import { z } from 'zod';
import { regExpPatterns } from '../utils/utils';
import { FileSchema } from './fileSchema';
import { Mode } from '../const';

export const UpdatePhraseQuerySchema = z
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

export const UpdatePhraseBodySchema = z.object({
  currentPhrase: z.string().min(2),
  newPhrase: z
    .string()
    .min(2)
    .transform((value) =>
      value.replace(regExpPatterns.removeMultipleSpaces, '')
    )
    .refine((value) => value.length > 0),
});

export const UpdatePhraseSchema = z.object({
  query: UpdatePhraseQuerySchema,
  file: FileSchema,
  body: UpdatePhraseBodySchema,
});

export type UpdatePhraseQuery = z.infer<typeof UpdatePhraseQuerySchema>;
export type UpdatePhraseBody = z.infer<typeof UpdatePhraseBodySchema>;
export type UpdatePhraseReq = z.infer<typeof UpdatePhraseSchema>;
