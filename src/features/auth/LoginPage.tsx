import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase';

import { LoginData, LoginForm } from './components/LoginForm';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { User } from './types/User';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const { user } = userCredential;
      const userPayload: User = { uid: user.uid, email: user.email };
      login(userPayload);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-input bg-card p-8 text-card-foreground shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default Login;
