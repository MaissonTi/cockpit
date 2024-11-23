//import { env } from '@saas/env'
import ky from 'ky';
import { getCsrfToken } from 'next-auth/react';
export type { Options } from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3000', //env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getCsrfToken();

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
