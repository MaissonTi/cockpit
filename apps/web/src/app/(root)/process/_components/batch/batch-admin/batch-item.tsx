import { MoneyInput } from '@/components/composition/money-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Batch } from '@/services/process.service';
import { CirclePause, CirclePlay, CircleStop } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useBatch } from '../../../_context/batch-context';
import BatchTime from '../batch-time';

interface Props {
  data: Batch;
}

function BatchItem({ data }: Props) {
  const { data: session } = useSession();
  const { timerActive, timerEvent, placeBid } = useBatch({
    currentBatch: data.id,
  });

  const [currentBid, setCurrentBid] = useState<any>(0);

  const handleSubmit = e => {
    e.preventDefault();
    const type = e.target.getAttribute('data-type');
    console.log(type);
    //timerEvent(type, [data.id])
  };

  return (
    <Card className="bg-white shadow-lg ml-2">
      <form className="flex items-center justify-between p-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div>
            <p>{data.name}</p>
          </div>
        </div>
        <div className="flex items-center flex-col">
          <BatchTime batchId={data.id} />
        </div>
        <div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <MoneyInput
              placeholder="Digite o valor..."
              value={currentBid}
              onValueChange={({ floatValue }) => setCurrentBid(floatValue)}
              disabled={!timerActive}
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
        <div className="flex gap-2">
          <Button
            className={!session?.isAdmin ? 'hidden' : ''}
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
            className={!session?.isAdmin ? 'hidden' : ''}
            onClick={() => timerEvent('stopTimer', [data.id])}
            variant="outline"
            type="button"
          >
            <CircleStop className="h-5 w-5 " size={24} />
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default BatchItem;
