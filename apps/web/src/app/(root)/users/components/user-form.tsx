'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useFormState } from '@/hooks/use-form-state';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { TInput } from '@/components/composition/form/t-input';
import { useParams, useRouter } from 'next/navigation';
import {
  userCreateAction,
  userUpdateAction,
  UserUpdateSchema,
} from '../actions';

interface UsersFormProps {
  isUpdating?: boolean;
  initialData?: UserUpdateSchema;
}

export function UsersForm({ initialData }: UsersFormProps) {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();

  const formAction = uuid ? userUpdateAction : userCreateAction;
  const label = uuid ? 'Atualizar' : 'Criar';

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {
      router.back();
    },
  );

  return (
    <>
      <h1 className="text-2xl font-bold">{label} Usuario</h1>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={uuid} />

          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Error so {label}</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <TInput
              name="name"
              label="Name"
              error={errors}
              defaultValue={initialData?.name}
            />
          </div>

          {!uuid && (
            <>
              <div className="space-y-1">
                <TInput name="email" label="E-mail" error={errors} />
              </div>

              <div className="space-y-1">
                <TInput name="password" label="Password" error={errors} />
              </div>

              <div className="space-y-1">
                <TInput
                  name="password_confirmation"
                  label="Confirm your password"
                  error={errors}
                />
              </div>
            </>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : label}
          </Button>
        </form>
      </div>
    </>
  );
}
