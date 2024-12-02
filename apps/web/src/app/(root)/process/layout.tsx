import BatchProvider from './_context/batch-context';
import ChatProvider from './_context/chat-context';
import { SocketProvider } from './_context/socket-context';
export async function ProcessLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SocketProvider>
        <ChatProvider>
          <BatchProvider>{children}</BatchProvider>
        </ChatProvider>
      </SocketProvider>
    </>
  );
}

export default ProcessLayout;
