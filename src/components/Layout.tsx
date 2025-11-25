import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Sidebar } from './Sidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWrapperClasses = cn(
    'absolute left-0 top-0 z-20 h-full lg:relative bg-background text-card-foreground transition-[width] duration-300 ease-in-out overflow-hidden',
    {
      'w-64': isSidebarOpen,
      'w-18': !isSidebarOpen,
    },
  );

  return (
    <div className="relative h-screen w-full lg:flex">
      <div className={sidebarWrapperClasses}>
        <Sidebar onSidebarToogle={toggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <main
        className="h-full w-full flex-1"
        onClick={() => setIsSidebarOpen(false)}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
