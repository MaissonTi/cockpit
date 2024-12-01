'use client';
import UserMessageService from '@/services/user-message.service';
import { UserMessageResponseDTO as Message } from '@repo/domain/dtos/user-message.dto';
import { useQuery } from '@tanstack/react-query';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState } from 'react';
import { useSocket } from './socket-context';

interface Options {
  group?: string;
  messages?: Message[];
}

type EventTimer = 'startTimer' | 'pauseTimer' | 'stopTimer' | 'resumeTimer';

type BatchContextProps = {
  group?: string;
  setGroup: (group: string) => void;
  session: User | null;
};

type UseBatchProps = Omit<BatchContextProps, 'setGroup'>;

const BatchContext = createContext<BatchContextProps | undefined>(undefined);

const BatchProvider: React.FC = ({ children }) => {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [group, setGroup] = useState<string>('');
  const [batch, setBatch] = useState<number[]>([]);

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
      //setMessages(result.data);
    }
  }, [result]);

  React.useEffect(() => {
    if (!socket || !group || !session) return;

    socket.emit('joinGroup', {
      group: group,
      user: session.name,
    });

    // socket.on('message', message => {
    //   setMessages(prev => {
    //     return [...prev, message];
    //   });
    // });

    return () => {
      socket.off('message');
    };
  }, [socket, group]);

  const timerEvent = (event: EventTimer, batch: number[]) => {
    if (!socket && !group && !session) return;

    socket!.emit(event, { group, batch });
  };

  return (
    <BatchContext.Provider value={{ group, setGroup, session, timerEvent }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = (options?: Options): UseBatchProps => {
  const context = useContext(BatchContext);
  if (!context) throw new Error('useBatch must be used within a BatchProvider');

  const { session, setGroup, group } = context;

  React.useEffect(() => {
    if (options?.group) {
      setGroup(options?.group);
    }
    // if (options?.messages) {
    //   setMessages(options?.messages);
    // }
  }, []);

  return { session, group };
};

export default BatchProvider;
