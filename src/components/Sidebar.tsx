import { signOut } from 'firebase/auth';
import { LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

import { Button } from './ui';

interface SidebarProps {
  onSidebarToogle: () => void;
  isOpen: boolean;
}

const navigatiomItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/drivers', label: 'Drivers' },
  { href: '/trucks', label: 'Trucks' },
  { href: '/loads', label: 'Loads' },
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
        alert(error.message);
      } else {
        alert('An unexpected error occurred during logout.');
      }
    }
  };

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        {isOpen && <h1 className="text-lg font-bold">FleetLink</h1>}
        <Button variant="ghost" size="icon" onClick={onSidebarToogle}>
          <Menu size={24} />
        </Button>
      </div>
      <nav
        className={cn(
          'flex-1 p-4 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      >
        <ul>
          {navigatiomItems.map(link => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  'block rounded p-2 hover:bg-accent/20 dark:hover:bg-white/10 transition-colors duration-300',
                  location.pathname === link.href &&
                    'bg-accent/20 dark:bg-white/10 font-medium',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
          className="mt-4 w-full"
          size={isOpen ? 'default' : 'icon'}
        >
          <LogOut className={cn({ 'mr-2': isOpen })} size={16} />
          {isOpen && 'Logout'}
        </Button>
      </div>
    </aside>
  );
}
