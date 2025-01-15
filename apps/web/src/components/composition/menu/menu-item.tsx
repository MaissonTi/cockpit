'use client';
import { ChevronDown } from 'lucide-react';
import React, { Fragment, JSX, useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function getState(open: boolean) {
  return open ? `open` : `closed`;
}

export type MenuItemType = {
  label: string;
  icon: JSX.Element;
  href?: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const MenuItem: React.FC<MenuItemType> = ({ icon, label, children, href }) => {
  const [open, setOpen] = useState(false);

  if (href) {
    return (
      <div className="mx-4">
        <Link
          href={href}
          data-active={open}
          className={cn(
            'flex items-center justify-between h-10 w-full px-4 relative',
            open &&
              'before:content-[""] before:bg-neutral-900 before:w-2 before:h-full before:absolute before:left-0 before:pointer-events-none before:transition-all before:duration-300 before:ease-out ',
          )}
        >
          <div className="ml-3 flex items-center gap-3 text-xs">
            {icon}
            {label}
          </div>
        </Link>
        <Separator className="my-1" />
      </div>
    );
  }

  return (
    <div className="mx-4">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between h-10 px-4 relative z-10  w-full',
        )}
      >
        <div className="ml-3 flex items-center gap-3 text-xs">
          {icon}
          {label}
        </div>
        <ChevronDown
          data-side={getState(open)}
          className={cn(
            'h-4 w-4 transition-all duration-300',
            'data-[side=open]:-rotate-180 data-[side=closed]:rotate-0',
          )}
        />
      </button>
      <Separator className="my-1" />
      <div
        data-side={getState(open)}
        className={cn(
          'flex flex-col z-0 ',
          'transition-all duration-300',
          'data-[side=closed]:opacity-0 data-[side=open]:opacity-100',
          'data-[side=closed]:h-0 data-[side=open]:h-10',
        )}
      >
        {children?.map((child, index) => (
          <Fragment key={index}>
            <Link
              href={child.href}
              className={cn(
                'ml-3 flex items-center justify-between h-16 w-full px-4 text-xs',
              )}
            >
              {child.label}
            </Link>
            <Separator className="my-1" />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MenuItem;
