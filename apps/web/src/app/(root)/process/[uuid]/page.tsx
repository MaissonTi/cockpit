import getMessages from '@/actions/user-message.action';
import ProcessForm from '../_components/process-form';

interface PageProps {
  params: {
    uuid?: string;
  };
}

export default async function ProcessDisputPage({ params }: PageProps) {
  if (!params.uuid) {
    return <div>...</div>;
  }

  const { data } = await getMessages(params.uuid);

  return (
    <div className="space-y-4 py-4">
      <main className="space-y-4">
        <ProcessForm params={{ group: params.uuid, messages: data }} />
      </main>
    </div>
  );
}
