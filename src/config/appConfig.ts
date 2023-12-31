import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const AppSchema = z.object({
  port: z
    .string()
    .transform((arg) => (isNaN(parseInt(arg)) ? 3000 : Number(arg))),
  host: z.string().nonempty(),
  hostName: z.string().nonempty(),
});

export const appConfig = AppSchema.parse({
  port: process.env.PORT,
  host: process.env.HOST,
  hostName: process.env.HOST_NAME,
});
