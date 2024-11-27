'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

let socketInstance: Socket | null = null;
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeListeners = (socket: Socket) => {
    // Adicione seus eventos de socket aqui
    socket.on('message', (message: string) => {
      console.log('New message:', message);
    });

    // Limpa os ouvintes para evitar duplicações
    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
    });
  };

  useEffect(() => {
    if (session?.accessToken && !socketInstance) {
      socketInstance = io('http://localhost:3333', {
        //auth: { token: session.accessToken },
        extraHeaders: {
          Authorization: session?.accessToken || '',
        },
        autoConnect: false,
        reconnection: true, // Enable reconnection
        reconnectionAttempts: 5, // Max reconnection attempts
        reconnectionDelay: 1000, // Initial delay
        reconnectionDelayMax: 5000, // Max delay between attempts
      });

      socketInstance.connect();

      // Handle socket events
      socketInstance.on('connect', () => {
        setIsConnected(true);
        setError(null);
        initializeListeners(socketInstance!); // Reinstale ouvintes após reconexão
      });

      socketInstance.on('disconnect', (reason) => {
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          setError('Disconnected by server');
        }
      });

      socketInstance.on('connect_error', (err) => {
        setError(`Connection error: ${err.message}`);
      });

      socketInstance.on('reconnect_attempt', (attempt) => {
        setError(`Reconnecting... (${attempt})`);
      });

      socketInstance.on('reconnect_failed', () => {
        setError('Reconnection failed');
      });

      socketInstance.connect();
      setSocket(socketInstance);

      setIsConnected(socketInstance.connected);

      return () => {
        socketInstance?.off(); // Remove todos os ouvintes ao desmontar
      };
    }

    return () => {
      socketInstance?.off(); // Remove todos os ouvintes ao desmontar
    };
  }, [session?.accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
