'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './WinnerHighlight.css';

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
  const [winner, setWinner] = useState<Bid | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [group, setGroup] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isInGroup, setIsInGroup] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('bidsUpdate', (updatedBids: Bid[]) => {
      setBids(updatedBids);
    });

    socket.on('winnerAnnounced', (highestBid: Bid) => {
      setWinner(highestBid);
    });

    socket.on('timerUpdate', ({ timerActive, timeRemaining }) => {
      setTimerActive(timerActive);
      setTimeRemaining(timeRemaining);
    });

    socket.on('groupJoined', ({ group, admin, timerActive, timeRemaining }) => {
      setIsInGroup(true);
      setIsAdmin(admin === username);
      setTimerActive(timerActive);
      setTimeRemaining(timeRemaining);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const joinGroup = () => {
    if (!group.trim()) {
      alert('Por favor, insira o nome do grupo.');
      return;
    }
    socket.emit('joinGroup', { group, user: username });
  };

  const startTimer = () => {
    if (!isInGroup) {
      alert('Você precisa entrar em um grupo antes de iniciar o timer.');
      return;
    }
    socket.emit('startTimer', { group, user: username });
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
    if (!timerActive) {
      alert('Os lances não estão ativos para este grupo.');
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
            style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="Digite o grupo"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
          />
          <button
            onClick={joinGroup}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
            }}
          >
            Entrar no Grupo
          </button>
        </div>

        <div>
          <h2>
            Tempo Restante:{' '}
            {timerActive ? `${timeRemaining}s` : 'Lances encerrados'}
          </h2>
          {isInGroup && isAdmin && !timerActive && (
            <button
              onClick={startTimer}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
              }}
            >
              Iniciar Lances (2 minutos)
            </button>
          )}
        </div>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            height: '300px',
            overflowY: 'scroll',
            marginTop: '20px',
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

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Digite sua mensagem"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            style={{ padding: '10px', width: '300px', marginRight: '10px' }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
            }}
          >
            Enviar
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Lances no Grupo</h2>
        {winner && (
          <div className="winner-container">
            <strong>🎉 Vencedor:</strong> {winner.user} com R${' '}
            {winner.amount.toFixed(2)}
          </div>
        )}
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
        {!winner && (
          <div
            style={{ marginTop: '10px', color: '#dc3545', fontWeight: 'bold' }}
          >
            {bids.length > 0
              ? `O próximo lance deve ser maior que R$ ${bids[bids.length - 1].amount.toFixed(2)}.`
              : 'Envie o primeiro lance para iniciar.'}
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <input
            type="number"
            placeholder="Digite seu lance"
            value={currentBid}
            onChange={(e) => setCurrentBid(parseFloat(e.target.value))}
            style={{ padding: '10px', width: '200px', marginRight: '10px' }}
          />
          <button
            onClick={placeBid}
            style={{
              padding: '10px 20px',
              backgroundColor: timerActive ? '#ffc107' : '#ccc',
              color: timerActive ? '#000' : '#666',
              cursor: timerActive ? 'pointer' : 'not-allowed',
            }}
            disabled={!timerActive}
          >
            Dar Lance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
