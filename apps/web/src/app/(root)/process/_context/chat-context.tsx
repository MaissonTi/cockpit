'use client';
import UserMessageService from '@/services/user-message.service';
import { UserMessageResponseDTO } from '@repo/domain/dtos/user-message.dto';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useSocket } from './socket-context';

type Message = UserMessageResponseDTO & {
  isSender: boolean;
  timestamp: string;
};

type Options = {
  group?: string;
  messages?: Message[];
};

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

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [group, setGroup] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: result } = useQuery({
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
    if (result) {
      const messageNew = result.data.map(item => {
        return {
          ...item,
          timestamp: format(new Date(item.createdAt), 'HH:mm', {
            locale: ptBR,
          }),
          isSender: item.userId === session?.id,
        };
      });
      setMessages(messageNew);
    }
  }, [result]);

  React.useEffect(() => {
    if (!socket || !group || !session) return;

    socket.emit('joinGroup', {
      group: group,
      user: session.name,
    });

    socket.on('message', message => {
      setMessages(prev => {
        return [...prev, message];
      });
    });

    return () => {
      socket.off('message');
    };
  }, [socket, group]);

  const sendMessage = (content: string) => {
    if (!socket && !group && !session) return;

    const newMessage: Omit<Message, 'createdAt' | 'isSender'> = {
      id: String(Date.now()),
      content: content,
      username: session?.name!,
      userId: session?.id!,
      destinateId: group,
      timestamp: format(new Date(), 'HH:mm', { locale: ptBR }),
    };

    socket!.emit('message', newMessage);
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

  React.useEffect(() => {
    if (options?.group) {
      setGroup(options?.group);
    }
    if (options?.messages) {
      const messageNew = options?.messages.map(item => {
        return {
          ...item,
          timestamp: format(new Date(item.createdAt), 'HH:mm', {
            locale: ptBR,
          }),
          isSender: item.userId === session?.id,
        };
      });

      setMessages(messageNew);
    }
  }, [session?.id]);

  return { session, messages, sendMessage, group };
};

export default ChatProvider;
