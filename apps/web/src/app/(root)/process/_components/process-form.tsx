'use client';
import { Batch } from '@/services/process.service';
import { useBatch } from '../_context/batch-context';
import { useChat } from '../_context/chat-context';
import BatchComponent from './batch/batch';
import Chat from './chat/chat';
interface Props {
  params: {
    group: string;
    messages: any;
    batch: Batch[];
  };
}

function ProcessForm({ params: { group, messages, batch } }: Props) {
  useChat({ group, messages });
  useBatch({ group, batch });

  return (
    <div className="mx-2 grid md:grid-cols-4">
      <div>
        <Chat />
      </div>
      <div className="col-span-3">
        <BatchComponent />
      </div>
    </div>
  );
}

export default ProcessForm;
