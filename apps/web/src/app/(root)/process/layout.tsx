import { SocketProvider } from './_context/SocketContext';
import ChatProvider from './_context/ChatContext';
export async function ProcessLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SocketProvider>
        <ChatProvider>{children}</ChatProvider>
      </SocketProvider>
    </>
  );
}

export default ProcessLayout;
