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
  notification: string | null;
  //winner: Bid | null;
  timerEvent: (event: EventTimer, batchs: string[]) => void;
  batchs: Batch[];
  setBatchs: (batch: Batch[]) => void;
  batchMap: Map<string, BatchTimer>;
  placeBid: (batch: string, amount: number) => void;
  bidsMap: Map<string, Batchbids[]>;
};

type BatchTimer = {
  timerActive: boolean;
  timeRemaining: number;
  timeUpdate: boolean;
};

type UseBatchProps = BatchTimer & { birds: any[] } & Omit<
    BatchContextProps,
    'setGroup' | 'setBatchs' | 'setCurrentBatch' | 'batchMap' | 'bidsMap'
  >;

// type Bid = {
//   user: string;
//   amount: number;
// };

type Batchbids = {
  user: string;
  amount: string;
};

const BatchContext = createContext<BatchContextProps | undefined>(undefined);

const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batchMap, setBatchMap] = useState<Map<string, BatchTimer>>(new Map());
  const [bidsMap, setBidsMap] = useState<Map<string, Batchbids[]>>(new Map());

  const { socket } = useSocket();
  const { data: session } = useSession();
  const [group, setGroup] = useState<string>('');
  const [batchs, setBatchs] = useState<Batch[]>([]);

  const [notification, setNotification] = useState<string | null>(null);
  //const [winner, setWinner] = useState<Bid | null>(null);

  React.useEffect(() => {
    if (!socket || !group || !session) return;

    socket.on(
      'timerUpdate',
      ({ timerActive, timeRemaining, batch, timeUpdate }) => {
        setBatchMap(
          map =>
            new Map(map.set(batch, { timeUpdate, timerActive, timeRemaining })),
        );
      },
    );

    socket.on('bidsUpdate', ({ amount, batch, user }) => {
      if (!batch) return;

      console.log('bidsUpdate', amount, batch, user);

      setBidsMap(map => {
        const existingBids = map.get(batch) || [];
        return new Map(
          map.set(batch, [
            ...existingBids,
            {
              amount: Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(amount),
              user,
            },
          ]),
        );
      });
    });

    socket.on('timerNotification', (data: { message: string }) => {
      setNotification(data.message);

      // Remove a notificação após 5 segundos
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    // socket.on('winnerAnnounced', (highestBid: Bid) => {
    //   setWinner(highestBid);
    // });

    return () => {
      socket.off('timerUpdate');
    };
  }, [socket, group]);

  const timerEvent = (event: EventTimer, batchs: string[]) => {
    if (!socket && !group && !session) return;
    socket!.emit(event, { group, batchs });
  };

  const placeBid = (batch: string, amount: number) => {
    if (!socket && !group && !session) return;

    socket!.emit('bid', {
      group,
      batch,
      user: session?.id,
      amount,
    });
  };

  return (
    <BatchContext.Provider
      value={{
        group,
        setGroup,
        session,
        timerEvent,
        notification,
        batchMap,
        //winner,
        batchs,
        setBatchs,
        placeBid,
        bidsMap,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

interface Options {
  group?: string;
  batchs?: Batch[];
  currentBatch?: string;
}

export const useBatch = (options?: Options): UseBatchProps => {
  const context = useContext(BatchContext);
  if (!context) throw new Error('useBatch must be used within a BatchProvider');

  const {
    session,
    setGroup,
    group,
    notification,
    batchMap,
    timerEvent,
    //winner,
    batchs,
    setBatchs,
    placeBid,
    bidsMap,
  } = context;

  const [timerActive, setTimerActive] = useState(false);
  const [timeUpdate, settimeUpdate] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<string | null>(null);
  const [birds, setBirds] = useState<any[]>([]);

  React.useEffect(() => {
    if (options?.group) {
      setGroup(options?.group);
    }
    if (options?.batchs) {
      setBatchs(options?.batchs);
    }
    if (options?.currentBatch) {
      setCurrentBatch(options?.currentBatch);
    }
  }, []);

  React.useEffect(() => {
    if (!currentBatch) return;

    const timerData = batchMap.get(currentBatch!);

    if (!timerData) return;

    setTimerActive(timerData.timerActive);
    setTimeRemaining(timerData.timeRemaining);
    settimeUpdate(timerData.timeUpdate);
  }, [currentBatch, batchMap]);

  React.useEffect(() => {
    if (!bidsMap.size) return;

    const array = Array.from(bidsMap.entries()).map(([batch, bids]) => {
      return {
        batch,
        birds: bids.map(({ user, amount }) => ({
          user,
          amount,
        })),
      };
    });

    setBirds(array);
  }, [currentBatch, bidsMap]);

  return {
    session,
    group,
    notification,
    timerActive,
    timeRemaining,
    timerEvent,
    //winner,
    batchs,
    placeBid,
    birds,
    timeUpdate,
  };
};

export default BatchProvider;
