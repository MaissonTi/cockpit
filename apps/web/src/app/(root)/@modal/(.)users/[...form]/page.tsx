import UserModal from '@/app/(root)/users/components/user-modal';

type Params = {
  params: unknown;
};

export default async function ModalPage({ params }: Params) {
  console.log('params', params);

  return (
    <div className="m-4 flex flex-col items-center justify-center">
      <UserModal />
    </div>
  );
}
