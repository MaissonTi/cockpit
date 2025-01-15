'use client';

import { useApp } from '@/providers/app-provider';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { AccountMenu } from './account-menu';
import { DarkMode } from './dark-mode';

export function Header() {
  const { toggleMenu } = useApp();

  return (
    <>
      <header className="fixed flex h-16 w-full items-center gap-6 px-3 shadow-head z-30 bg-neutral-50">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => toggleMenu()}>
            <Menu className="h-6 w-6" />
          </Button>

          <Image
            src="/icons/logo2.png"
            width={130}
            height={60}
            alt="Finance AI"
          />
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <DarkMode />
          <AccountMenu />
        </div>
      </header>
      <div className="h-16" />
    </>
  );
}
