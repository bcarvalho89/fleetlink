import { Menu } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Sidebar } from './Sidebar';
import { Button } from './ui';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWrapperClasses = cn(
    'absolute left-0 top-0 z-20 h-full bg-card text-card-foreground transition-all duration-300 ease-in-out overflow-hidden',
    {
      'w-64': isSidebarOpen,
      'w-0': !isSidebarOpen,
    },
  );

  return (
    <div className="relative h-screen w-full">
      <div className={sidebarWrapperClasses}>
        <Sidebar onSidebarToogle={toggleSidebar} />
      </div>
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute left-4 top-4 z-10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <main className="h-full w-full" onClick={() => setIsSidebarOpen(false)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
