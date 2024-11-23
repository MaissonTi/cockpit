import { signIn as signInNext, signOut as signOutNext } from "next-auth/react";
//import { redirect } from "next/navigation";

export async function signInSocial( social = 'google' ) {
  try {
     await signInNext(social, { callbackUrl: "/auth/signin", redirect: false });

    // if(response?.error) {
    //   redirect("/auth/signin");
    // }
  } catch (err) {
    console.log('signInSocial', err)
    throw err;
  }
}

export async function signOut() {
  await signOutNext({ callbackUrl: "/auth/signin" });
}

export async function signIn({ email, password }: { email: string, password: string }) {
  try {
    const response = await signInNext("credentials", {
      email,
      password,
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
}
