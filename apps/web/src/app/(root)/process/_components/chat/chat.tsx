import React from 'react';
import ChatInput from './chat-input';
import ChatWindow from './chat-window';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

const Chat: React.FC = () => {
  return (
    <Card className="flex flex-col h-full max-w-md mx-auto bg-white shadow-lg">
      <CardContent className="p-4">
        <ChatWindow />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 p-4">
        <ChatInput />
      </CardFooter>
    </Card>
  );
};

export default Chat;
