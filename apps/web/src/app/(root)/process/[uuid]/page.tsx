import ProcessForm from '../_components/process-form';

interface PageProps {
  params: {
    uuid?: string;
  };
}

export default function ProcessDisputPage({ params }: PageProps) {
  return (
    <div className="space-y-4 py-4">
      <main className="space-y-4">
        <ProcessForm />
      </main>
    </div>
  );
}
