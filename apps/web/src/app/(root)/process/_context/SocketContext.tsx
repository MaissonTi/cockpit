'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useSocket from './useSocket';

type SocketContextType = {
  socket: ReturnType<typeof useSocket>['socket'];
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { socket, isConnected } = useSocket();

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
