import React, { FormEvent, useState } from 'react';
import { useChat } from '../../_context/chat-context';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="flex items-center space-x-2" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        className="flex-1 p-2 border rounded-lg focus:outline-none"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
