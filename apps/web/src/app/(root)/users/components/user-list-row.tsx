import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';

export type RetrunAction = {
  type: 'edit' | 'delete';
  values: { [key: string]: unknown };
  action?: () => void | unknown;
};

export interface CustomTableRowProps {
  data: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  onAction(params: RetrunAction): void;
}

export function UserListRow({ data, onAction }: CustomTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">{data.id}</TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.email}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(data.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>

      <TableCell className="flex">
        <Button
          data-id={data.id}
          onClick={() => onAction({ type: 'edit', values: { id: data.id } })}
          variant="ghost"
        >
          <Pencil className="h-5 w-5 text-blue-500 " />
        </Button>
        <Button
          data-id={data.id}
          onClick={() => onAction({ type: 'delete', values: { id: data.id } })}
          variant="ghost"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
