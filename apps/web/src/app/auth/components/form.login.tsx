"use client";

import FormSocialLogin from "./form-social.login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signIn } from "@/actions/auth.action";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInSchema = z.infer<typeof signInSchema>;

const FormLogin = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  async function handleAuthenticate({ email, password }: SignInSchema) {
    try {
      const response = await signIn({ email, password });

      console.log(response);

      if (response?.ok) {
        router.push("/");
      } else {
        console.error(response?.error?.message);
        setError("Check your Credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Check your Credentials");
    }
  }

  return (
    <>
      <div className="text-xl text-red-500">{error}</div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Image
              src="/icons/logo2.png"
              width={173}
              height={39}
              layout="responsive"
              alt="Finance AI"
              className="mb-2"
            />
            <p className="text-sm text-muted-foreground">Seja bem-vindo</p>
          </div>

          <div className="grid">
            <form onSubmit={handleSubmit(handleAuthenticate)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="email">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...register("email")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="email">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...register("password")}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  Acessar sistema
                </Button>
              </div>
            </form>

            <FormSocialLogin />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormLogin;
