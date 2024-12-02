'use client';
import { Batch } from '@/services/process.service';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useSocket } from './socket-context';

type EventTimer = 'startTimer' | 'pauseTimer' | 'stopTimer' | 'resumeTimer';

type BatchContextProps = {
  group?: string;
  setGroup: (group: string) => void;
  session: User | null;
  timerActive: boolean;
  timeRemaining: number;
  notification: string | null;
  winner: Bid | null;
  timerEvent: (event: EventTimer, batch: string[]) => void;
  batch: Batch[];
  setBatch: (batch: Batch[]) => void;
};

type UseBatchProps = Omit<BatchContextProps, 'setGroup' | 'setBatch'>;

const BatchContext = createContext<BatchContextProps | undefined>(undefined);

interface Bid {
  user: string;
  amount: number;
}

const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [group, setGroup] = useState<string>('');
  const [batch, setBatch] = useState<Batch[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [winner, setWinner] = useState<Bid | null>(null);

  // const { data: result } = useQuery({
  //   queryKey: ['user-message', group],
  //   queryFn: () =>
  //     UserMessageService.list({
  //       currentPage: 1,
  //       perPage: 20,
  //       filters: {
  //         destinateId: group,
  //       },
  //     }),
  // });

  // React.useEffect(() => {
  //   if (result) {
  //     setBatch(result.data);
  //   }
  // }, [result]);

  React.useEffect(() => {
    if (!socket || !group || !session) return;

    socket.on('timerUpdate', ({ timerActive, timeRemaining }) => {
      setTimerActive(timerActive);
      setTimeRemaining(timeRemaining);
    });

    socket.on('timerNotification', (data: { message: string }) => {
      setNotification(data.message);

      // Remove a notificação após 5 segundos
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    socket.on('winnerAnnounced', (highestBid: Bid) => {
      setWinner(highestBid);
    });

    return () => {
      socket.off('timerUpdate');
    };
  }, [socket, group]);

  const timerEvent = (event: EventTimer, batch: string[]) => {
    if (!socket && !group && !session) return;

    console.log('timerEvent', event, batch);

    socket!.emit(event, { group, batch });
  };

  return (
    <BatchContext.Provider
      value={{
        group,
        setGroup,
        session,
        timerEvent,
        notification,
        timerActive,
        timeRemaining,
        winner,
        batch,
        setBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

interface Options {
  group?: string;
  batch?: Batch[];
}

export const useBatch = (options?: Options): UseBatchProps => {
  const context = useContext(BatchContext);
  if (!context) throw new Error('useBatch must be used within a BatchProvider');

  const {
    session,
    setGroup,
    group,
    notification,
    timerActive,
    timeRemaining,
    timerEvent,
    winner,
    batch,
    setBatch,
  } = context;

  React.useEffect(() => {
    if (options?.group) {
      setGroup(options?.group);
    }
    if (options?.batch) {
      setBatch(options?.batch);
    }
  }, []);

  return {
    session,
    group,
    notification,
    timerActive,
    timeRemaining,
    timerEvent,
    winner,
    batch,
  };
};

export default BatchProvider;
