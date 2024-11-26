'use server';

import UserMessageService from '@/services/user-message.service';

export default async function getMessages(group: string): Promise<any> {
  try {
    return await UserMessageService.list(
      {
        currentPage: 1,
        perPage: 20,
        filters: {
          destinateId: group,
        },
      },
      { cache: 'no-cache' },
    );
  } catch (error) {
    return error;
  }
}
