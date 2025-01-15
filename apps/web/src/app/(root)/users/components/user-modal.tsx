'use client';
import UserFormPage from '@/app/(root)/users/form/[[...uuid]]/page';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePushParams } from '@/hooks/use-push-params';

interface UserModalProps {
  params?: {
    uuid?: string;
  };
}

const UserModal: React.FC<UserModalProps> = ({ params }) => {
  const [push, searchParams, back] = usePushParams();

  console.log(searchParams);

  return (
    <Dialog defaultOpen={true} onOpenChange={() => back()}>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <DialogHeader className="flex">
            <DialogTitle>Form User</DialogTitle>
          </DialogHeader>

          <div className="m-4">
            <UserFormPage params={params || {}} />
          </div>
        </div>
        <DialogFooter>teste</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
