import { z } from 'zod';

export const isBuffer = (value: unknown): value is Buffer =>
  value instanceof Buffer;

export const FileSchema = z.object({
  fieldname: z.string().nonempty(),
  originalname: z.string().nonempty(),
  encoding: z.string().nonempty(),
  mimetype: z.string().nonempty(),
  buffer: z.unknown().refine(isBuffer),
  size: z.number().min(1),
});

export type FileInfo = z.infer<typeof FileSchema>;
