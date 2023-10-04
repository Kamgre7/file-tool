import { z } from 'zod';
import { EditFileParamSchema, FileSchema } from './editFileSchema';
import { checkLineParamsValue, transformParams } from './utilSchemas';

export const UpdateFileBodySchema = z.object({
  updatedPhrase: z.string().nonempty(),
});

export const UpdateFileSchema = z.object({
  params: EditFileParamSchema.refine((value) =>
    checkLineParamsValue(value)
  ).transform((value) => transformParams(value)),
  file: FileSchema,
  body: UpdateFileBodySchema,
});

export type UpdateFileReq = z.infer<typeof UpdateFileSchema>;
