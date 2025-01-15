import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateZod } from '@/helper/validate-action';
import { useFormState } from '@/hooks/use-form-state';
import { usePushParams } from '@/hooks/use-push-params';
import { FormState } from '@/hooks/use-t-form';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { z } from 'zod';

const userFiltersSchema = z.object({
  name: z.string().optional(),
  page: z.number().optional(),
});

type UserFiltersSchema = z.infer<typeof userFiltersSchema>;

export function UserListFilters() {
  const formRef = useRef<HTMLFormElement>(null);

  const { push, searchParams } = usePushParams<UserFiltersSchema>();

  const name = searchParams.get('name') || '';

  const { handleSubmit } = useFormState<UserFiltersSchema>(
    handleFilter,
    data => {
      if (data) {
        const { page, name } = data as UserFiltersSchema;
        push({ search: { page, name } });
      }
    },
  );

  async function handleFilter(data: FormData): Promise<FormState> {
    const result = validateZod<UserFiltersSchema>({
      data,
      schema: userFiltersSchema,
    });

    const page = 1;
    const name = result.data?.name ?? '';
    return { ...result, data: { name, page } };
  }

  function handleClearFilters() {
    formRef?.current?.reset();
    push({ path: '/users' });
  }

  const hasAnyFilter = !!name;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between flex-wrap gap-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Filtros:</span>
        <Input
          name="name"
          placeholder="Nome do usuario"
          className="h-8 max-w-[320px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" variant="secondary" size="sm">
          <Search className="mr-2 h-4 w-4" />
          Aplicar
        </Button>

        <Button
          type="button"
          variant="outline"
          size="default"
          disabled={!hasAnyFilter}
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </div>
    </form>
  );
}
