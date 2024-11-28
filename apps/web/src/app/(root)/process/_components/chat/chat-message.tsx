import React from 'react';

interface ChatMessageProps {
  content: string;
  sender: string;
  isSender: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, isSender, timestamp }) => {
  const bubbleClasses = isSender
    ? 'self-end bg-blue-500 text-white animate-slideInLeft'
    : 'self-start bg-gray-100 text-black animate-slideInLeft';

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}  `}>
      <div className={`flex flex-col p-3 rounded-lg max-w-[75%] ${bubbleClasses}`}>
        {!isSender && <span className="text-sm font-bold mb-1">{sender}</span>}
        <p className="break-words leading-3">{content}</p>
        <span className="text-xss mt-1 self-end">{timestamp}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
