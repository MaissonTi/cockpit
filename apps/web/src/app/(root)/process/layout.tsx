import { SocketProvider } from './_context/socket-context';
import ChatProvider from './_context/chat-context';
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
