import React from 'react';
import ChatMessage from './chat-message';
import useChatScroll from '../../_hooks/useChatScroll';
import { useChat } from '../../_context/ChatContext';

const ChatWindow: React.FC = () => {
  const { session, messages } = useChat();

  // Usar o hook com mensagens como dependência
  const {
    containerRef,
    isAtBottom,
    unreadMessages,
    scrollToBottom,
    handleScroll,
  } = useChatScroll({
    dependencies: [messages],
  });

  return (
    <div className="flex flex-col max-h-[550px] p-4 bg-gray-100 rounded-lg shadow overflow-hidden">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto max-h-[450px] space-y-2 h-screen p-2 scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track"
        onScroll={handleScroll}
      >
        {messages &&
          messages.map((item) => (
            <ChatMessage
              key={item.id}
              content={item.content}
              sender={item.username}
              isSender={item.userId === session?.id}
              timestamp={item.timestamp}
              color={item.userId === session?.id ? '#1D4ED8' : '#fffe'}
            />
          ))}
      </div>

      {!isAtBottom && unreadMessages > 0 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <span>Novas mensagens</span>
          <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadMessages}
          </span>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
