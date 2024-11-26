'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';
import { ptBR, se } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketContext';
import { User } from 'next-auth';
import { queryClient } from '@/lib/react-query';
import UserMessageService from '@/services/user-message.service';
import { useQuery } from '@tanstack/react-query';

interface Message {
  group: string;
  user: string;
  message: {
    id: number;
    userId: string;
    content: string;
    timestamp: string;
  };
}

interface Options {
  group?: string;
  messages?: Message[];
}

type ChatContextProps = {
  group?: string;
  setGroup: (group: string) => void;
  setMessages: (message: Message[]) => void;
  session: User | null;
  messages: Message[];
  sendMessage: (content: string) => void;
};

type UseChatProps = Omit<ChatContextProps, 'setGroup' | 'setMessages'>;

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
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [group, setGroup] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    data: result,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user-message', group],
    queryFn: () =>
      UserMessageService.list({
        currentPage: 1,
        perPage: 20,
        filters: {
          destinateId: group,
        },
      }),
  });

  React.useEffect(() => {
    console.log(result, group);
    if (result) {
      setMessages(
        result.data.map((message) => {
          return {
            group: message.destinateId,
            user: 'Teste:' + message.userId, //message.user,
            message: {
              id: Number(message.id),
              userId: message.userId,
              content: message.content,
              timestamp: message?.createdAt?.toString() || '',
            },
          };
        }),
      );
    }
  }, [result]);

  React.useEffect(() => {
    if (!socket || !group || !session) return;

    socket.emit('joinGroup', {
      group: group,
      user: session.name,
    });

    socket.on('message', (message) => {
      setMessages((prev) => {
        return [...prev, message];
      });
    });

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, [socket, group]);

  const sendMessage = (content: string) => {
    console.log(socket, group, session);

    if (!socket && !group && !session) return;

    const newMessage: Message = {
      group: group,
      user: session?.name!,
      message: {
        id: Date.now(),
        userId: session?.id || '',
        content,
        timestamp: format(new Date(), 'HH:mm', { locale: ptBR }),
      },
    };

    socket.emit('message', newMessage);
  };

  return (
    <ChatContext.Provider
      value={{ group, setGroup, session, messages, sendMessage, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (options?: Options): UseChatProps => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');

  const { session, messages, sendMessage, setGroup, group, setMessages } =
    context;

  // Aqui você pode adicionar lógica para ações baseadas no grupo
  React.useEffect(() => {
    if (options?.group) {
      console.log('Mudou o grupo', options?.group);
      setGroup(options?.group);
    }
    if (options?.messages) {
      console.log(options?.messages);
      setMessages(options?.messages);
    }
  }, [options?.group]);

  return { session, messages, sendMessage, group };
};

export default ChatProvider;
