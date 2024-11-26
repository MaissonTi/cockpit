import NextAuth from 'next-auth';

declare module 'next-auth' {
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
    accessToken: string;
  }

  interface Session {
    id: string;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
    accessToken: string;
  }
}
