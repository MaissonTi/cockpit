import { Header } from "@/components/composition/header";

export async function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
}

export default HomeLayout;
