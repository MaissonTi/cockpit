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
  const [userCount, setUserCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [groupWillBeDeleted, setGroupWillBeDeleted] = useState(false);

  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMjllMmY1YS01ZjQzLTQ0MmItYTNjZC00NzM1MGIzZDBkMjgiLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3MzIzMjc1NDB9.E4gUr1n9yspRZU9qV4l1Ozl-EwBevIpiufmf-SK6yfvD3onHiWw8GbvV2auISxrvJimGnLuVhpbYpsHoaZON2wYnajIouys_n2TxanFmqEU9FN3uIYlZgmhXMKnNlpaxP_wlPOVuZelbjJ-efLFFTXagmbGgz3Vy9bSlgVI5d_qqFiEsxfcdvJqTVDYozfbwZJcvKOq1UCLaNnzj5hzdBB8hQbs0aVLaugKwQtfpFc81sD4u_oWZFWE9zcGcCf7FNr_XXWHkGdsLKdv6g0xkMvi2GaF4vNjkowxKa8UbXFpKN6J1gWddR9vyqtxzKoC7DHBGb3lhopu48mJ0fVba3w';

  useEffect(() => {
    socket = io('http://localhost:3000', {
      extraHeaders: {
        Authorization: token,
      },
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('userCountUpdate', (count: number) => {
      setUserCount(count);
    });

    socket.on('message', message => {
      setMessages(prev => [...prev, message]);
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

    socket.on('timerNotification', (data: { message: string }) => {
      setNotification(data.message);

      // Remove a notificação após 5 segundos
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    socket.on('userCountUpdate', (count: number) => {
      setUserCount(count);
    });

    socket.on('groupClosed', (message: string) => {
      alert(message);

      // Reseta os estados locais
      setIsInGroup(false);
      setBids([]);
      setWinner(null);
      setTimerActive(false);
      setTimeRemaining(0);
      setUserCount(0);
    });

    // socket.on('groupDeleted', (deletedGroup: string) => {
    //   //if (group === deletedGroup) {
    //   alert(`O grupo ${deletedGroup} foi excluído pelo administrador.`);
    //   setIsInGroup(false);
    //   setBids([]);
    //   setWinner(null);
    //   setTimerActive(false);
    //   setTimeRemaining(0);
    //   setUserCount(0);
    //   setGroup(''); // Reseta o nome do grupo localmente
    //   //}
    // });

    socket.on('groupWillBeDeleted', ({ group, timeout }) => {
      if (group === group) {
        setGroupWillBeDeleted(true);

        setTimeout(() => {
          setGroupWillBeDeleted(false);
          alert(`O grupo ${group} foi excluído.`);
          resetGroupState();
        }, timeout * 1000);
      }
    });

    // Evento para resetar o grupo quando for deletado
    socket.on('groupDeleted', (deletedGroup: string) => {
      if (group === deletedGroup) {
        resetGroupState();
      }
    });

    return () => {
      socket.off('groupWillBeDeleted');
      socket.off('groupDeleted');
      socket.off('timerUpdate');
      socket.off('groupJoined');
      socket.disconnect();
    };
  }, [username, group]);

  const resetGroupState = () => {
    setIsInGroup(false);
    setBids([]);
    setWinner(null);
    setTimerActive(false);
    setTimeRemaining(0);
    setUserCount(0);
    setGroup('');
  };

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

  const pauseTimer = () => {
    if (!isAdmin) {
      alert('Apenas o administrador pode pausar o cronômetro.');
      return;
    }
    socket.emit('pauseTimer', { group, user: username });
  };

  const stopTimer = () => {
    if (!isAdmin) {
      alert('Apenas o administrador pode parar o cronômetro.');
      return;
    }
    socket.emit('stopTimer', { group, user: username });
  };

  const resumeTimer = () => {
    if (!isAdmin) {
      alert('Apenas o administrador pode continuar o cronômetro.');
      return;
    }
    socket.emit('resumeTimer', { group, user: username });
  };

  const leaveGroup = () => {
    if (!isInGroup) {
      alert('Você não está em nenhum grupo.');
      return;
    }

    // Emite o evento para o backend
    socket.emit('leaveGroup', group);

    if (isAdmin) {
      // Se for administrador, o grupo será excluído
      alert(`Você excluiu o grupo ${group}.`);
    } else {
      // Se for um usuário normal, apenas sai
      alert(`Você saiu do grupo ${group}.`);
    }

    // Reseta o estado local
    setIsInGroup(false);
    setBids([]);
    setWinner(null);
    setTimerActive(false);
    setTimeRemaining(0);
    setUserCount(0);
    setGroup('');
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

        {groupWillBeDeleted && (
          <div
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            O grupo será excluído em 5 segundos. Aguarde...
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="Digite o grupo"
            value={group}
            onChange={e => setGroup(e.target.value)}
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
          {isInGroup && (
            <button
              onClick={leaveGroup}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              {isAdmin ? 'Encerrar' : 'Sair do Grupo'}
            </button>
          )}
        </div>

        <div>
          <div>
            <h2>
              Tempo Restante:{' '}
              {timerActive ? `${timeRemaining}s` : 'Cronômetro pausado'}
            </h2>
          </div>
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
                <span
                  style={{
                    fontSize: '0.8em',
                    color: '#888',
                    marginLeft: '10px',
                  }}
                >
                  11/12/2021 10:00
                  {/* {new Date(msg.createdAt).toLocaleString()} */}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Digite sua mensagem"
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
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
        {notification && (
          <div
            style={{
              backgroundColor: '#ffef96',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {notification}
          </div>
        )}
        <div
          style={{ marginBottom: '10px', color: '#007bff', fontWeight: 'bold' }}
        >
          Usuários Online: {userCount}
        </div>
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
              ? `O próximo lance deve ser maior que R$ ${bids[bids.length - 1]?.amount.toFixed(2) || 0}.`
              : 'Envie o primeiro lance para iniciar.'}
          </div>
        )}
        {isAdmin && timeRemaining > 0 && (
          <div style={{ marginTop: '20px' }}>
            {timerActive ? (
              <button
                onClick={pauseTimer}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Pausar Cronômetro
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Continuar Cronômetro
              </button>
            )}
            <button
              onClick={stopTimer}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Parar Cronômetro
            </button>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <input
            type="number"
            placeholder="Digite seu lance"
            value={currentBid}
            onChange={e => setCurrentBid(parseFloat(e.target.value))}
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
