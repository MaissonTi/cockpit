import { useState, useTransition } from 'react';
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
export interface FormState<T extends FieldValues = FieldValues> {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
  data?: T | FieldValues;
}

type UseTFormReturn = UseFormReturn & { isPending: boolean; data: FormState };

export function useTForm<T extends FieldValues = FieldValues>(
  action: (data: T) => Promise<FormState> | FormState,
  onSuccess?: (data?: Pick<FormState, 'data'>) => Promise<void> | void,
  initialState?: DefaultValues<T>,
) {
  const {
    register,
    handleSubmit: submit,
    reset,
    ...rest
  } = useForm<T>({
    defaultValues: initialState as DefaultValues<T>,
  });
  const [isPending, startTransition] = useTransition();

  const [dataForm, setDataForm] = useState<FormState<T>>({
    data: initialState,
    success: false,
    message: null,
    errors: null,
  });

  async function handleSubmit(data: T): Promise<void> {
    startTransition(async () => {
      const state = await action(data);

      if (state.success && onSuccess) {
        await onSuccess(state.data);
      }
      setDataForm(state as FormState<T>);
    });
    return;
  }

  return {
    dataForm,
    handleSubmit: submit(handleSubmit),
    register,
    reset,
    isPending,
    ...rest,
  } as unknown as UseTFormReturn;
}
