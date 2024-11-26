import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

declare module 'next-auth' {
  interface User {
    access_token?: string;
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
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:3333/sessions', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        const { user, access_token } = (await res.json()) as {
          user: User;
          access_token: string;
        };

        if (res.ok && user && access_token) {
          return { ...user, access_token };
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
        //console.log('profile -----------------------------------------------------', profile)
        // gmail 100923893644933301087
        // ripio 110119254361704976828
        return {
          id: profile.sub,
          name: profile.name,
          username: '',
          email: profile.email,
          avatar_url: profile.picture,
        };
      },
    }),
  ],
  events: {
    signIn: async (message) => {},
  },
  callbacks: {
    async signIn(data) {
      return true;
    },
    async jwt({ token, account, user }) {
      if (account?.type === 'credentials') {
        token.accessToken = user?.access_token;
        token.user = user;
      }

      // if(account?.type === 'google') {
      //   token.accessToken = account?.accessToken;
      // }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        return {
          ...session,
          ...token?.user,
          accessToken: token.accessToken,
          isAdmin: token?.user?.role === 'ADMIN',
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
