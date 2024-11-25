'use client';
import { Process } from '@/services/process.service';
import { useSession } from 'next-auth/react';
import Chat from './chat/chat';

interface Props {
  data: Omit<Process, 'batch'>;
}

function ProcessForm({ data }: Props) {
  const { data: session } = useSession();

  return (
    <div className="grid md:grid-cols-4 gap-4 my-10">
      <div style={{ border: '1px solid red' }} className="flex-1">
        <Chat />
      </div>
      <div style={{ border: '1px solid red' }} className="col-span-2">
        Lances
      </div>
      <div style={{ border: '1px solid red' }}>Historico</div>
    </div>
  );
}

export default ProcessForm;
