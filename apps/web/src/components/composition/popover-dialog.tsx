'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { Button } from '../ui/button';

interface PopoverDialogProps {
  description: string;
  onConfirme(): void;
  children: React.ReactNode;
}

const PopoverDialog: React.FC<PopoverDialogProps> = ({
  description,
  onConfirme,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-56 mx-2 bg-gray-50">
        <div className="text-xs ">{description}</div>
        <Separator className="my-2" />
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Desistir
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              onConfirme();
            }}
            className="text-xs"
            variant="default"
            size="sm"
          >
            Continuar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverDialog;
