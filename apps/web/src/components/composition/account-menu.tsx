import { signOut } from '@/actions/auth.action';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Settings, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function AccountMenu() {
  const { data: session } = useSession();

  const isLoadingProfile = false;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="flex select-none items-center"
          >
            <User className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                {session?.user?.name}
                <span className="text-xs font-normal text-muted-foreground">
                  Role{/* {session?.user?.role} */}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              asChild
              className="text-rose-500 dark:text-rose-400"
            >
              <button className="w-full" onClick={() => handleSignOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
