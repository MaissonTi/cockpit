import { notFound } from 'next/navigation';
import { UsersForm } from '../../components/user-form';
import { use } from 'react';
import UserService from '@/services/user.service';
import { UserUpdateSchema } from '../../actions';

interface PageProps {
  params: {
    uuid?: string;
  };
}

export default function UserFormPage({ params }: PageProps) {
  let initialData = {} as UserUpdateSchema;

  if (params.uuid) {
    const data = use(UserService.find(params.uuid, { cache: 'no-cache' }));
    if (!data) return notFound();
    initialData = data;
  }

  return (
    <div className="space-y-4 py-4">
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <UsersForm initialData={initialData} />
      </main>
    </div>
  );
}
