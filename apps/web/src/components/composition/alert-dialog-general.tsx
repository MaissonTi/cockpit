'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogGeneralProps, useListAlert } from '@/hooks/use-alert';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';

export function AlertDialogGeneral({
  title,
  open,
  onOpenChange,
  callback,
  description,
  isAsync,
}: AlertDialogGeneralProps) {
  const [isPending, setPending] = useState(false);

  const execute = useCallback(() => {
    if (isAsync) {
      setPending(true);
    }

    return callback && callback('confirm');
  }, [callback, isAsync]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => callback && callback('cancel')}>
            Não
          </AlertDialogCancel>
          <AlertDialogAction onClick={execute}>
            {isPending ? (
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              'Sim'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ProviderAlert() {
  const { alerts } = useListAlert();

  return (
    <div>
      {alerts.map(function ({ id, ...props }) {
        return <AlertDialogGeneral key={id} {...props} />;
      })}
    </div>
  );
}
