'use server';

import ProcessService, { Process } from '@/services/process.service';

export default async function getProcess(
  group: string,
): Promise<Process | null> {
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

  return data[0] || null;
}
