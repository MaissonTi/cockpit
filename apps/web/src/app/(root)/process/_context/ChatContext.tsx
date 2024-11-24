import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: number;
  name: string;
  color: string; // Adicionamos uma propriedade para a cor
}

interface Message {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
}

interface ChatContextProps {
  users: User[];
  messages: Message[];
  sendMessage: (userId: number, content: string) => void;
  addUser: (name: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Função para gerar uma cor aleatória em hexadecimal
const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Você', color: '#1D4ED8' }, // Azul fixo para "Você"
    { id: 2, name: 'Amigo', color: getRandomColor() },
    { id: 3, name: 'Carlos', color: getRandomColor() },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      userId: 1,
      content: 'Olá! Tudo bem?',
      timestamp: format(new Date(), 'HH:mm', { locale: ptBR }),
    },
    {
      id: 2,
      userId: 2,
      content: 'Oi! Tudo ótimo, e você?',
      timestamp: format(new Date(), 'HH:mm', { locale: ptBR }),
    },
  ]);

  const sendMessage = (userId: number, content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      userId,
      content,
      timestamp: format(new Date(), "'Hoje,' HH:mm", { locale: ptBR }),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const addUser = (name: string) => {
    const newUser: User = {
      id: users.length + 1,
      name,
      color: getRandomColor(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <ChatContext.Provider value={{ users, messages, sendMessage, addUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export default ChatProvider;
