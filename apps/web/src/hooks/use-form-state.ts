import { FormEvent, useState, useTransition } from 'react';
export interface FormState<T> {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
  data?: T;
}

export function useFormState<T>(
  action: (data: FormData) => Promise<FormState<T>>,
  onSuccess?: (data?: T | undefined) => Promise<void> | void,
  initialState?: FormState<T>,
) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState(
    initialState ?? { data: null, success: false, message: null, errors: null },
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const state = await action(data);

      if (state.success && onSuccess) {
        await onSuccess(state.data);
      }

      setFormState(state);
    });
  }

  return { formState, handleSubmit, isPending } as const;
}
