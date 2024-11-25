import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UseSocketReturn = {
  socket: Socket | null;
  isConnected: boolean;
};

const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzhjODYxMy0yNGFkLTQ2ZTQtOWFiZC0zZTNmMGM2NDhkYzIiLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzMyNDkyMzc3fQ.3K0vjfWkaWkGzl-BYRfe6c1nqyzZeLZL1ZgbfXIMDRIHS1t69yp5I2af_TFIA4WJFdHQ6XCrCuSDuKghjlevG3-hIqbye2GgKH-0a4xef3qjczaL27ckgpWNCD9Zjyt64JezXZyasmXWVDRAHR8HTrDLvRN2S0feUpT9XKewIFg_4LjdVGVLyoRTIkCZtHvk6oAHBRIQHSzW4LmyiaXR0f6mkhVfAFOgMmBi9BtlQSIxxfqWwDxkx1PdELs-Ozm3mHknHRmbaX4iU-QmioC00yqg9OKrNv1d-qisv2aaofmTKhv021Q32EdqbStkXna_OcMDV-TCOx62lA5WRQqBoQ';

  useEffect(() => {
    const socketInstance = io('http://localhost:3333', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        Authorization: token,
      },
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // socketInstance.on("ping", () => {
    //   console.log("Cliente está ativo");
    // });

    // setInterval(() => {
    //   socketInstance.disconnect(true); // Desconecta se o cliente estiver inativo
    // }, 300000); // 5 minutos

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};

export default useSocket;
