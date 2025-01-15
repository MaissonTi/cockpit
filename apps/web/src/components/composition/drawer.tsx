'use client';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

enum DrawerSide {
  Left = 'left',
  Right = 'right',
}

enum DrawerPlatform {
  Web = 'web',
  Mobile = 'mobile',
}

function getState(open: boolean) {
  return open ? `open` : `closed`;
}

function getSide(open: boolean, platform: string) {
  return open ? `${platform}-open` : `${platform}-closed`;
}

const drawerVariants = cva(
  'gap-4 bg-background shadow-lg data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        left: cn(
          //mobile
          'data-[side=mobile-closed]:-translate-x-full data-[side=mobile-open]:translate-x-0',
          'data-[platform=mobile]:inset-y-0 data-[platform=mobile]:left-0',
          //web
          'data-[side=web-closed]:w-0 data-[side=web-open]:max-w-xs',
        ),
        right: cn(
          //mobile
          'data-[side=mobile-open]:translate-x-0 data-[side=mobile-closed]:translate-x-full',
          'data-[platform=mobile]:inset-y-0 data-[platform=mobile]:right-0',
          //web
          'data-[side=web-closed]:w-0 data-[side=web-open]:max-w-xs',
        ),
      },
      platform: {
        web: 'h-full w-full z-0 transition-all duration-500 relative',
        mobile: 'fixed max-w-xs w-3/4 z-20 p-6',
      },
    },
    defaultVariants: {
      platform: DrawerPlatform.Web,
      side: DrawerSide.Left,
    },
  },
);

interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}
const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  className,
  children,
  open = true,
  ...props
}) => {
  return (
    <div
      data-state={getState(open)}
      className={cn(
        'fixed inset-0 z-20 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
};

interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open?: boolean;
  onClose?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  side = DrawerSide.Left,
  platform = DrawerPlatform.Web,
  className,
  children,
  open = true,
  onClose,
  ...props
}) => {
  return (
    <>
      {platform === DrawerPlatform.Mobile && open && (
        <DrawerOverlay onClick={onClose} className={className} />
      )}
      <div
        data-state={getState(open)}
        data-side={getSide(open, platform!)}
        data-platform={platform}
        className={cn(drawerVariants({ platform, side }), className)}
        {...props}
      >
        {platform === DrawerPlatform.Web && !open ? <></> : children}
      </div>
    </>
  );
};

export { Drawer };
