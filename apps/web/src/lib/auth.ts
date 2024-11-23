import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

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
        const res = await fetch('http://localhost:3000/sessions', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        const { user, access_token } = (await res.json()) as {
          user: any;
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
    signIn: async (message) => {
      //console.log('signIn-signIn -----------------------------------------------------', message)
    },
  },
  callbacks: {
    async signIn(data) {
      //console.log('signIn -----------------------------------------------------')
      return true;
    },
    async jwt({ token, account, user }) {
      //console.log('jwt ------------------------------------------')
      if (account?.type === 'credentials') {
        token.accessToken = user?.access_token;
      }

      // if(account?.type === 'google') {
      //   token.accessToken = account?.accessToken;
      // }

      //console.log('jwt', token, account, user)

      return token;
    },
    async session(data) {
      //console.log('session ------------------------------------------')
      return data.session;
    },
  },
};

export default NextAuth(authOptions);
