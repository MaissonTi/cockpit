import Image from "next/image";

export async function AuthLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="relative h-full w-full">
        <Image
          src="/login.png"
          alt="Faça login"
          fill
          className="object-cover"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
