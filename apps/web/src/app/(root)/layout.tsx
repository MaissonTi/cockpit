import { Header } from '@/components/composition/header';
import Menu from '@/components/composition/menu/menu';

export async function HomeLayout({
  children, // will be a page or nested layout
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header></Header>
      <div className="flex">
        <Menu />
        <div className="m-4 w-full">{children}</div>
      </div>
      {modal}
    </>
  );
}

export default HomeLayout;
