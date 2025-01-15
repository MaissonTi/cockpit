import 'next-auth';
declare module 'next-auth' {
  interface User {
    access_token?: string;
    role: string;
    isAdmin: boolean;
    avatar_url?: string;
    username?: string;
  }

  interface Session {
    user: User;
    accessToken: string;
    isAdmin: boolean;
  }
}
