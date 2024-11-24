import React, { useState } from 'react';
import { useChat } from '../../_context/ChatContext';

const UserManager: React.FC = () => {
  const { users, addUser } = useChat();
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName);
      setNewUserName('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Gerenciar Usuários</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Nome do novo usuário"
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Adicionar
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-2 bg-white rounded-lg shadow">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
