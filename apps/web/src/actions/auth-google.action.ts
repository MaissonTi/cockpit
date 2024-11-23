// 'use server'

// import { env } from '@saas/env';
// import { redirect } from 'next/navigation';

// const clientId = "SEU_CLIENT_ID";  // substitua com seu client_id
// const redirectUri = "http://localhost:3000";  // URL de redirecionamento registrada no Google Cloud Console
// const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
// const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
// const tokenEndpoint = "https://oauth2.googleapis.com/token";
// const userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

// export async function signInWithGithub() {
//   const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

//   githubSignInURL.searchParams.set('client_id', env.AUTH_GOOGLE_ID)
//   githubSignInURL.searchParams.set('google_secret', env.AUTH_GOOGLE_SECRET)
//   githubSignInURL.searchParams.set('scope', 'user')

//   redirect(githubSignInURL.toString())
// }
