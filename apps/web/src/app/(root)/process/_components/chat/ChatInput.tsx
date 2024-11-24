import React, { useState } from 'react';
import { useChat } from '../../_context/ChatContext';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(1);
  const { sendMessage, users } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(selectedUser, message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <select
          className="p-2 border rounded-lg"
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
