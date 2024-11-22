'use client';
// pages/index.tsx
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface Bid {
  user: string;
  amount: number;
}

const Home = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    [],
  );
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [group, setGroup] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isInGroup, setIsInGroup] = useState(false);

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

    // Escuta lances
    socket.on('bidsUpdate', (updatedBids: Bid[]) => {
      setBids(updatedBids);
    });

    // Confirmação de entrada no grupo
    socket.on('groupJoined', (joinedGroup) => {
      console.log(`Entrou no grupo: ${joinedGroup}`);
      setIsInGroup(true);
    });

    // Cleanup na desconexão
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGroup = () => {
    if (!group.trim()) {
      alert('Por favor, insira o nome do grupo.');
      return;
    }
    socket.emit('joinGroup', group);
  };

  const sendMessage = () => {
    if (!username.trim()) {
      alert('Por favor, insira um nome de usuário.');
      return;
    }
    if (!currentMessage.trim()) {
      alert('Por favor, escreva uma mensagem antes de enviar.');
      return;
    }
    if (!isInGroup) {
      alert('Você precisa entrar em um grupo antes de enviar mensagens.');
      return;
    }

    socket.emit('message', { group, user: username, text: currentMessage });
    setCurrentMessage('');
  };

  const placeBid = () => {
    if (!username.trim()) {
      alert('Por favor, insira um nome de usuário.');
      return;
    }
    if (currentBid <= 0) {
      alert('O lance deve ser maior que zero.');
      return;
    }
    if (!isInGroup) {
      alert('Você precisa entrar em um grupo antes de enviar lances.');
      return;
    }

    socket.emit('bid', { group, user: username, amount: currentBid });
    setCurrentBid(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Chat e Formulário */}
      <div style={{ flex: 2, marginRight: '20px' }}>
        <h1>Chat com Grupos e Lances</h1>
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
          <input
            type="text"
            placeholder="Digite o grupo"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '300px',
              display: 'block',
            }}
          />
          <button
            onClick={joinGroup}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Entrar no Grupo
          </button>
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

      {/* Lista de Lances */}
      <div style={{ flex: 1 }}>
        <h2>Lances no Grupo</h2>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            height: '400px',
            overflowY: 'scroll',
          }}
        >
          {bids.length === 0 ? (
            <p>Nenhum lance ainda.</p>
          ) : (
            bids.map((bid, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <strong>{bid.user}:</strong> R$ {bid.amount.toFixed(2)}
              </div>
            ))
          )}
        </div>
        <div style={{ marginTop: '20px' }}>
          <input
            type="number"
            placeholder="Digite seu lance"
            value={currentBid}
            onChange={(e) => setCurrentBid(parseFloat(e.target.value))}
            style={{
              padding: '10px',
              width: '200px',
              marginRight: '10px',
            }}
          />
          <button
            onClick={placeBid}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Dar Lance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
