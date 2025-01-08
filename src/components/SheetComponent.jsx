import React from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

const SideSheet = ({ isOpen, onClose, title, children }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex justify-center mb-4">
          <SheetTitle>{title}</SheetTitle>
          {/* <SheetClose asChild>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <X size={24} />
            </button>
          </SheetClose> */}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default SideSheet;