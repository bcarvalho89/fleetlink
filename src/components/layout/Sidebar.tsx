import { signOut } from 'firebase/auth';
import { Activity, Box, LogOut, Menu, TruckIcon, Users, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

import { Button } from '../ui';

interface SidebarProps {
  onSidebarToogle: () => void;
  isOpen: boolean;
}

const navigatiomItems = [
  { href: '/', label: 'Dashboard', icon: Activity },
  { href: '/drivers', label: 'Drivers', icon: Users },
  { href: '/trucks', label: 'Trucks', icon: TruckIcon },
  { href: '/loads', label: 'Loads', icon: Box },
];

export function Sidebar({ onSidebarToogle, isOpen }: SidebarProps) {
  const { user, logout } = useAuthStore(state => state);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred during logout.');
      }
    }
  };

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        {isOpen && <h1 className="text-lg font-bold">FleetLink</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToogle}
          aria-label="Toggle sidebar"
        >
          <X size={24} className="lg:hidden" />
          <Menu size={24} className="max-lg:hidden" />
        </Button>
      </div>
      <nav
        className={cn(
          'flex-1 p-4 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      >
        <ul className="space-y-1">
          {navigatiomItems.map(link => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'rounded p-2 hover:bg-accent/20 dark:hover:bg-white/10 transition-colors duration-300 flex gap-2 items-center',
                    location.pathname === link.href &&
                      'bg-accent/20 dark:bg-white/10 font-medium',
                  )}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <div
          className={cn(
            'flex items-center gap-4 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
        >
          <p className="truncate text-sm">{user?.email}</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className={cn('mt-4 w-full', {
            // 'max-lg:invisible': !isOpen,
          })}
          size={isOpen ? 'default' : 'icon'}
        >
          <LogOut className={cn({ 'mr-2': isOpen })} size={16} />
          {isOpen && 'Logout'}
        </Button>
      </div>
    </aside>
  );
}
