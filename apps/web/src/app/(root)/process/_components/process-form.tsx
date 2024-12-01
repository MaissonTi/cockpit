'use client';
import { useChat } from '../_context/chat-context';
import Batch from './batch/batch';
import Chat from './chat/chat';
interface Props {
  params: {
    group: string;
    messages: any;
  };
}

function ProcessForm({ params: { group, messages } }: Props) {
  useChat({ group, messages });

  return (
    <div className="mx-2 grid md:grid-cols-4">
      <div>
        <Chat />
      </div>
      <div className="col-span-3">
        <Batch />
      </div>
    </div>
  );
}

export default ProcessForm;
