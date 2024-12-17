import getProcess from '@/actions/process.action';
import { redirect } from 'next/navigation';
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

  const process = await getProcess(params.uuid);

  if (process) {
    return (
      <div className="space-y-4 py-4">
        <main className="space-y-4">
          <ProcessForm
            params={{
              group: params.uuid,
              messages: process.usersMessagens,
              batchs: process.batch,
            }}
          />
        </main>
      </div>
    );
  }

  redirect('/process');
}
