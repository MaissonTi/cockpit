//import { env } from '@saas/env'
import ky from 'ky';
import { getSession } from 'next-auth/react';
export type { Options } from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333', //env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async request => {
        const session = (await getSession()) as { accessToken: string } | null;

        if (session?.accessToken) {
          request.headers.set(
            'Authorization',
            `Bearer ${session?.accessToken}`,
          );
        }
      },
    ],
  },
});
