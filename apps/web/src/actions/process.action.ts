'use server';

import ProcessService, { Batch } from '@/services/process.service';

export default async function getProcess(group: string): Promise<Batch[]> {
  const { data } = await ProcessService.list(
    {
      currentPage: 1,
      perPage: 20,
      filters: {
        destinateId: group,
      },
    },
    { cache: 'no-cache' },
  );

  return data[0]?.batch || [];
}
