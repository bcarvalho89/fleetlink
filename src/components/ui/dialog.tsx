import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        lastFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const wrapperClasses = cn(
    'relative m-4 w-full max-w-lg rounded-lg bg-white p-4 shadow-xl animate-in fade-in-0 zoom-in-95 sm:p-6',
    className,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/60 animate-in fade-in-0"
        onClick={onClose}
      ></div>
      <div ref={dialogRef} className={wrapperClasses}>
        <div className="flex items-center justify-between">
          <h2 id="dialog-title" className="text-xl font-semibold">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full hover:bg-gray-100 hover:text-gray-800 "
          >
            <X size={18} />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
