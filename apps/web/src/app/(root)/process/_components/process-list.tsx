'use client';

import { z } from 'zod';
import { Loader2Icon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useQuery, useMutation } from '@tanstack/react-query';
import { ProcessSkeleton } from './process-skeleton';
import { usePushParams } from '@/hooks/use-push-params';

import { queryClient } from '@/lib/react-query';
import ProcessService from '@/services/process.service';
import ProcessItem from './process-item';

import { useSession } from 'next-auth/react';
import { useSocket } from '../_context/SocketContext';

export default function ProcessList() {
  const [push] = usePushParams();

  const {
    data: result,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['process-list-page'],
    queryFn: () =>
      ProcessService.list({
        currentPage: 1,
        perPage: 10,
      }),
  });

  const { mutateAsync: startProcess } = useMutation({
    mutationFn: ProcessService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['process-list-page'],
      });
    },
  });

  function handleStartProcess(id: string) {
    push({ path: `/process/${id}` });
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Process
            {isFetching && (
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
        </div>

        <div className="space-y-2.5">
          {isLoading && !result && <ProcessSkeleton />}

          {result?.data &&
            result.data.map((process) => {
              return (
                <ProcessItem
                  key={process.id}
                  data={process}
                  onClick={handleStartProcess}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
