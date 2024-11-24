import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Process } from '@/services/process.service';
import { useSession } from 'next-auth/react';

interface Props {
  data: Omit<Process, 'batch'>;
}

function ProcessItem({ data }: Props) {
  const { data: session } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Status: {data.status}</div>
        <div>Sessão: {data.isOpen ? 'Aberta' : 'Fechada'}</div>
      </CardContent>
      <CardFooter className="flex gap-1">
        <Button className="w-full">
          {session?.isAdmin ? 'Iniciar' : 'Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProcessItem;
