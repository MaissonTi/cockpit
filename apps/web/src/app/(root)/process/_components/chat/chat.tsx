import React from 'react';
import ChatProvider from '../../_context/ChatContext';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import UserManager from './UserManager';

const Chat: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-lg">
        <div className="p-4">
          <ChatWindow />
        </div>
        <div className="p-4">
          <ChatInput />
        </div>
        <div className="p-4">
          <UserManager />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;
