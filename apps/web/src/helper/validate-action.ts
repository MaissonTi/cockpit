import { ZodSchema, z } from 'zod';

import { HTTPError } from 'ky';

interface ResponseAction<T = unknown | null> {
  success: boolean;
  message: string | null;
  data?: T;
  errors: Record<string, string[]> | null;
}

type Params = {
  data: FormData | Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: (...args: any[]) => any;
};

type ParamsZod = Params & {
  schema: ZodSchema;
};

export async function validateAction(params: Params): Promise<ResponseAction> {
  const { data, service } = params;

  try {
    const response = await service(data);

    return { success: true, message: null, errors: null, data: response };
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null, data: null };
    }

    console.error(err);

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
      data: null,
    };
  }
}

export async function validateActionZod(
  params: ParamsZod,
): Promise<ResponseAction> {
  const { data, schema, service } = params;

  const result = schema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value ?? [],
      ]),
    );

    return { success: false, message: null, errors, data: null };
  }

  return validateAction({ data: result.data, service });
}

export function validateZod<T>(
  params: Omit<ParamsZod, 'service'>,
): ResponseAction<T> {
  const { data, schema } = params;

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value ?? [],
      ]),
    );

    return { success: false, message: null, errors, data: undefined };
  }

  return {
    success: true,
    message: null,
    errors: null,
    data: result.data as z.infer<typeof schema>,
  };
}
