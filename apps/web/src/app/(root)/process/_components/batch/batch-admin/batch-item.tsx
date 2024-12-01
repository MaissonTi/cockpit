import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Batch } from '@/services/process.service';
import { AlarmClock, AlarmClockCheck, AlarmClockMinus } from 'lucide-react';
import { useChat } from '../../../_context/chat-context';

interface Props {
  data: Batch;
}

const Icone: { [key: string]: JSX.Element } = {};
Icone['play'] = (
  <AlarmClock className="h-5 w-5 animate-shake text-green-600" size={24} />
);
Icone['finish'] = (
  <AlarmClockCheck className="h-5 w-5 text-green-600" size={24} />
);
Icone['pause'] = <AlarmClock className="h-5 w-5 text-orange-500" size={24} />;
Icone['stop'] = <AlarmClockMinus className="h-5 w-5 text-red-600" size={24} />;
Icone['init'] = <AlarmClock className="h-5 w-5 text-gray-500" size={24} />;
// style={{ border: '1px solid red' }}

function BatchItem({ data }: Props) {
  const {} = useChat();

  return (
    <Card className="bg-white shadow-lg">
      <form className="flex items-center justify-between p-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <p>{Icone['init']}</p>
          <div>
            <p>{data.name}</p>
            <p>02 Part</p>
          </div>
        </div>
        <div>
          <p>Não iniciado</p>
          <p>--:--</p>
        </div>
        <div>
          <p>Melhor valor R$ 100,00</p>
          <p>Seu valor R$ 100,00</p>
        </div>
        <div className="flex">
          <Input type="text" />
          <Button type="submit"> Enviar </Button>
        </div>
      </form>
    </Card>
  );
}

export default BatchItem;
