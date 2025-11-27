import { Menu } from 'lucide-react';
import React from 'react';

import { useThemeStore } from '@/features/theme';
import { cn } from '@/lib/utils';

import { Button } from '../ui';

import { Sidebar } from './Sidebar';

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { sidebarExpanded, toggleSidebar } = useThemeStore();

  const sidebarWrapperClasses = cn(
    'absolute left-0 top-0 z-20 h-full lg:relative bg-background text-card-foreground transition-[width] duration-300 ease-in-out overflow-hidden lg:border-r border-foreground/40',
    {
      'w-64 ': sidebarExpanded,
      'w-0 lg:w-18': !sidebarExpanded,
    },
  );

  return (
    <div className="relative h-screen w-full lg:flex">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="lg:hidden mt-2 ml-2"
      >
        <Menu size={24} />
      </Button>

      <div className={sidebarWrapperClasses}>
        <Sidebar onSidebarToogle={toggleSidebar} isOpen={sidebarExpanded} />
      </div>
      <main className="h-full w-full flex-1">{children}</main>
    </div>
  );
};

export default MainContent;
