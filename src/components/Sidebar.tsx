import { ChevronLeft, LogOut } from 'lucide-react';
import { Button } from './ui';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface SidebarProps {
  onSidebarToogle: () => void;
}

export function Sidebar({ onSidebarToogle }: SidebarProps) {
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
        <h1 className="text-lg font-bold">FleetLink</h1>
        <Button variant="ghost" size="icon" onClick={onSidebarToogle}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li>
            <a href="#" className="block rounded p-2 hover:bg-accent">
              Home
            </a>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <p className="truncate text-sm">{user?.email}</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="mt-4 w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
