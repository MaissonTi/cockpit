import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import React, { JSX, useMemo, useState } from 'react';
import { Button } from '../ui/button';

interface CollapsibleMenuProps {
  children: React.ReactNode;
  title: {
    name: string;
    icon?: JSX.Element;
    children?: JSX.Element;
  };
}

const CollapsibleMenu: React.FC<CollapsibleMenuProps> = ({
  children,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const Icon = useMemo(() => {
    return isOpen ? ChevronDown : ChevronLeft;
  }, [isOpen]);

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border-2 border-gray-100 mb-2"
      >
        <div className="flex flex-row justify-between items-center content-center p-2 bg-gray-100 dark:bg-neutral-950 ">
          <div className="flex items-center h-5">
            <div className="min-h-5 min-w-5">{title.icon}</div>
            <span className="ml-2 text-sm">{title.name}</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2">{title.children}</div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Icon />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollapsibleMenu;
