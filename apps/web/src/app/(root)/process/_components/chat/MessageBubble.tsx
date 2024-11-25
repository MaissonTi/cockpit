import React from 'react';

interface MessageBubbleProps {
  content: string;
  sender: string;
  isSender: boolean;
  timestamp: string;
  color: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  isSender,
  timestamp,
  color,
}) => {
  const bubbleClasses = isSender
    ? 'self-end bg-blue-500 text-white animate-slideInLeft'
    : 'self-start bg-gray-100 text-black animate-slideInLeft';

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}  `}>
      <div
        className={`flex flex-col p-3 rounded-lg max-w-[75%] ${bubbleClasses}`}
        style={!isSender ? { backgroundColor: color } : undefined}
      >
        {!isSender && <span className="text-sm font-bold mb-1">{sender}</span>}
        <p className="break-words">{content}</p>
        <span className="text-xs mt-1 text-gray-200 self-end">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
