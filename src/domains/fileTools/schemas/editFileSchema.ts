import { z } from 'zod';
import {
  Mode,
  checkLineParamsValue,
  isBuffer,
  transformParams,
} from './utilSchemas';

export const FileSchema = z.object({
  fieldname: z.string().nonempty(),
  originalname: z.string().nonempty(),
  encoding: z.string().nonempty(),
  mimetype: z.string().nonempty(),
  buffer: z.unknown().refine(isBuffer),
  size: z.number().min(1),
});

export const EditFileParamSchema = z.object({
  phrase: z.string().nonempty(),
  mode: z.nativeEnum(Mode),
  line: z.string().optional(),
});

export const EditFileSchema = z.object({
  params: EditFileParamSchema.refine((value) =>
    checkLineParamsValue(value)
  ).transform((value) => transformParams(value)),
  file: FileSchema,
});

export type Params = z.infer<typeof EditFileParamSchema>;
export type EditFileReq = z.infer<typeof EditFileSchema>;
