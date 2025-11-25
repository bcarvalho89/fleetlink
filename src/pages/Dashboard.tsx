import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(state => state);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login');
    } catch (error: any) {
      // TODO Create a toast component for feedbacks
      alert(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the FleetLink dashboard, {user?.email}.</p>

      <Button onClick={handleLogout} variant="destructive" className="mt-4">
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
