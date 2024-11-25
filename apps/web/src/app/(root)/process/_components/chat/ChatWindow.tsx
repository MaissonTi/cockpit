import React from 'react';
import MessageBubble from './MessageBubble';
import useChatScroll from '../../_hooks/useChatScroll';
import { useChat } from '../../_context/ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, users } = useChat();

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

  const getUserById = (userId: number) =>
    users.find((user) => user.id === userId);

  return (
    <div className="flex flex-col max-h-[550px] p-4 bg-gray-100 rounded-lg shadow overflow-hidden">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto max-h-[450px] space-y-2"
        onScroll={handleScroll}
      >
        {messages.map((message) => {
          const user = getUserById(message.userId);
          return user ? (
            <MessageBubble
              key={message.id}
              content={message.content}
              sender={user.name}
              isSender={message.userId === 1}
              timestamp={message.timestamp}
              color={user.color}
            />
          ) : null;
        })}
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
