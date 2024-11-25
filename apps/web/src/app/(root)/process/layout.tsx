import { SocketProvider } from './_context/SocketContext';

export async function ProcessLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
}

export default ProcessLayout;
