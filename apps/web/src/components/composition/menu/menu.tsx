'use client';
import useMediaQuery, { MOBILE_MEDIA_QUERY } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { useApp } from '@/providers/app-provider';
import { Separator } from '@radix-ui/react-separator';
import { Home, Users } from 'lucide-react';
import React, { useState } from 'react';
import MenuItem, { MenuItemType } from './menu-item';

const json = [
  {
    label: 'Início',
    icon: <Home className="h-4 w-4" />,
    href: '/',
  },
  {
    label: 'Users',
    icon: <Users className="h-4 w-4" />,
    children: [
      {
        label: 'Users',
        href: '/users',
      },
    ],
  },
] as MenuItemType[];

function getState(open: boolean) {
  return open ? `open` : `closed`;
}

const Menu: React.FC = () => {
  const [platform, setPlatform] = useState<'web' | 'mobile'>('web');

  const { toggleMenu, openMenu } = useApp();

  useMediaQuery(MOBILE_MEDIA_QUERY, isMatching => {
    if (isMatching) {
      setPlatform('mobile');
      toggleMenu(false);
    } else {
      setPlatform('web');
    }
  });

  return (
    <>
      {platform === 'mobile' && openMenu && (
        <div
          data-name="overlay"
          data-state={getState(openMenu)}
          className={cn(
            'fixed inset-0 z-10 bg-black/50 mt-16',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
          onClick={() => toggleMenu(false)}
        />
      )}

      <div
        data-name="base"
        data-side={getState(openMenu)}
        className={cn(
          'flex transition-all box-border',
          platform === 'web' &&
            'data-[side=closed]:w-0 data-[side=open]:w-[310px]',
          platform === 'mobile' && 'w-0',
        )}
      />
      <div
        className={cn(
          'flex z-10 h-full w-[240px] fixed shadow-md border-r bg-white box-border',
          'transition-all data-[state=closed]:duration-300 data-[state=open]:duration-500',
          'data-[side=closed]:-translate-x-full data-[side=open]:translate-x-0',
        )}
        data-side={getState(openMenu)}
      >
        <Separator orientation="vertical" className="h-6" />

        <nav className="flex flex-col w-full">
          {json.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Menu;
