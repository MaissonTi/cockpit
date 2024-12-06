import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Batch } from '@/services/process.service';
import { CirclePause, CirclePlay, CircleStop } from 'lucide-react';
import { useState } from 'react';
import { useBatch } from '../../../_context/batch-context';

interface Props {
  data: Batch;
}

const getTimeClass = timeInSeconds => {
  if (timeInSeconds <= 10) {
    return 'text-red-600 font-bold text-2xl transition-all duration-300'; // Destaque para os últimos 10 segundos
  }
  return 'text-black font-normal text-lg'; // Estilo padrão
};

const formatTime = timeInSeconds => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  // Formata os valores para sempre ter dois dígitos
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};

function BatchItem({ data }: Props) {
  const { timerActive, timeRemaining, timerEvent, placeBid } = useBatch({
    currentBatch: data.id,
  });

  const [currentBid, setCurrentBid] = useState<number>(0);

  const handleSubmit = e => {
    e.preventDefault();
    const type = e.target.getAttribute('data-type');
    console.log(type);
    //timerEvent(type, [data.id])
  };

  return (
    <Card className="bg-white shadow-lg">
      <form className="flex items-center justify-between p-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div>
            <p>{data.name}</p>
          </div>
        </div>
        <div>
          <p>Tempo</p>
          <p className={getTimeClass(timeRemaining)}>
            {timerActive
              ? `${formatTime(timeRemaining)}`
              : 'Cronômetro pausado'}
          </p>
        </div>
        <div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="number"
              placeholder="Digite seu lance"
              value={currentBid}
              onChange={e => setCurrentBid(parseFloat(e.target.value))}
            />
            <Button
              type="button"
              disabled={!timerActive}
              onClick={() => placeBid(data.id, currentBid)}
            >
              Dar Lance
            </Button>
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={() => timerEvent('startTimer', [data.id])}
            variant="outline"
            type="button"
          >
            <CirclePlay className="h-5 w-5" size={24} />
          </Button>
          <Button
            onClick={() => timerEvent('pauseTimer', [data.id])}
            variant="outline"
            type="button"
          >
            <CirclePause className="h-5 w-5" size={24} />
          </Button>
          <Button
            onClick={() => timerEvent('resumeTimer', [data.id])}
            variant="outline"
            type="button"
            className="bg-red-500"
          >
            <CirclePause className="h-5 w-5" size={24} />
          </Button>
          <Button
            onClick={() => timerEvent('stopTimer', [data.id])}
            variant="outline"
            type="button"
          >
            <CircleStop className="h-5 w-5" size={24} />
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default BatchItem;
