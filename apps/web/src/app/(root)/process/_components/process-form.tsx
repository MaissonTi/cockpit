'use client';
import Chat from './chat/chat';
import { useChat } from '../_context/chat-context';
interface Props {
  params: {
    group: string;
    messages: any;
  };
}

function ProcessForm({ params: { group, messages } }: Props) {
  useChat({ group, messages });

  return (
    <Chat />
    // <div className="grid md:grid-cols-4 gap-4 my-10">
    //   <div style={{ border: '1px solid red' }} className="flex-1">
    //     <Chat />
    //   </div>
    //   <div style={{ border: '1px solid red' }} className="col-span-2">
    //     Lances
    //   </div>
    //   <div style={{ border: '1px solid red' }}>Historico</div>
    // </div>
  );
}

export default ProcessForm;
