import React from 'react';
import ChatWindow from './chat-window';
import ChatInput from './chat-input';

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-lg">
      <div className="p-4">
        <ChatWindow />
      </div>
      <div className="p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
