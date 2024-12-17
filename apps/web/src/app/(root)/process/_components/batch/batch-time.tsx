import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useBatch } from '../../_context/batch-context';

interface Props {
  batchId: string;
}

const getTimeClass = (timeInSeconds: number) => {
  if (timeInSeconds <= 10 && timeInSeconds > 0) {
    return 'text-red-600 font-bold text-2xl transition-all duration-300'; // Destaque para os últimos 10 segundos
  }
  return 'font-normal text-lg'; // Estilo padrão
};

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  // Formata os valores para sempre ter dois dígitos
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};

function BatchTime({ batchId }: Props) {
  const { timerActive, timeRemaining, timeUpdate } = useBatch({
    currentBatch: batchId,
  });

  const [displayTime, setdisplayTime] = useState<boolean>(false);

  useEffect(() => {
    if (timeUpdate) {
      setdisplayTime(true);
      setTimeout(() => {
        setdisplayTime(false);
      }, 4000);
    }
  }, [timeUpdate]);

  return (
    <TooltipProvider>
      <Tooltip
        open={displayTime}
        defaultOpen={false}
        disableHoverableContent={false}
      >
        <TooltipTrigger>
          <p>Tempo</p>
          <p className={getTimeClass(timeRemaining)}>
            {timerActive ? `${formatTime(timeRemaining)}` : '--:--'}
          </p>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span className="text-sm text-green-500">+{200}s</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default BatchTime;
