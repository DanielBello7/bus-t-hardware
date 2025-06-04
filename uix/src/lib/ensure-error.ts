import { AxiosError } from 'axios';
import { ZodError } from 'zod';

export function ensure_error(err: unknown): Error {
  if (err instanceof ZodError) {
    const newError = new Error(err.errors[0].message);
    return newError;
  }
  if (err instanceof AxiosError) {
    if (err.response) {
      const newError = new Error(err.response.data.msg);
      return newError;
    }
  }
  if (err instanceof Error) return err;
  let stringText = '[unable to stringify thrown error]';
  try {
    stringText = JSON.stringify(err);
  } catch {}
  const error = new Error(`value thrown as is: ${stringText}`);
  return error;
}
