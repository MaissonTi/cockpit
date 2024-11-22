'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const Home = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    [],
  );
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conecta ao servidor WebSocket
    socket = io('http://localhost:3000'); // Substitua pelo URL do servidor NestJS

    // Escuta a conexão
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao servidor WebSocket');
    });

    // Escuta mensagens
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup na desconexão
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!username.trim()) {
      alert('Por favor, insira um nome de usuário.');
      return;
    }
    if (!currentMessage.trim()) {
      alert('Por favor, escreva uma mensagem antes de enviar.');
      return;
    }

    socket.emit('message', { user: username, text: currentMessage });
    setCurrentMessage('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chat com WebSocket</h1>
      {!isConnected ? (
        <p style={{ color: 'red' }}>Conectando ao servidor...</p>
      ) : (
        <p style={{ color: 'green' }}>Conectado ao servidor.</p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '300px',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '20px',
        }}
      >
        {messages.length === 0 ? (
          <p>Nenhuma mensagem ainda.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Digite sua mensagem"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            marginRight: '10px',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Home;
