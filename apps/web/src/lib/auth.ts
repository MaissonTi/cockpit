import NextAuth, { AuthOptions, Session, User } from 'next-auth';
import { Account, JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User & { isAdmin?: boolean };
    accessToken?: string;
  }

  interface Account {
    type?: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
      ) {
        if (!credentials) return null;

        const res = await fetch('http://localhost:3333/sessions', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        const data: { user: User; access_token: string } = await res.json();

        if (res.ok && data.user && data.access_token) {
          return { ...data.user, access_token: data.access_token };
        }

        return null;
      },
    }),
    GoogleProvider({
      name: 'google',
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: profile.email.split('@')[0],
          email: profile.email,
          avatar_url: profile.picture,
          role: 'USER', // Default role, can be updated dynamically
          isAdmin: false, // Default value
          accessToken: '', // Placeholder for future use
        };
      },
    }),
  ],
  events: {
    // Optional event handlers
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account?: Account | null;
      user?: User | null;
    }): Promise<JWT> {
      if (account?.type === 'credentials' && user) {
        token.accessToken = user.access_token;
        token.user = user as User & { isAdmin?: boolean };
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token?.user) {
        session.user = token.user;
        session.accessToken = token.accessToken || '';
        session.isAdmin = token.user.role === 'ADMIN';
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
