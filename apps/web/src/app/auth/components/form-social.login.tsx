"use client";
import { signInSocial } from "@/actions/auth.action";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const FormSocialLogin = () => {
  async function handleAuthenticate() {
    await signInSocial();
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-4 flex items-center justify-center">
        <Separator className="my-4" />
        <p className="mx-2 whitespace-nowrap"> ou entrar com </p>
        <Separator className="my-4" />
      </div>

      <button onClick={handleAuthenticate}>
        <Image
          src="/icons/social_google_logo.png"
          width={40}
          height={40}
          layout="responsive"
          alt="Connect Google"
        />
      </button>
    </div>
  );
};

export default FormSocialLogin;
