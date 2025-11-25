import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { User } from '../types/User';
import { Button } from '../components/ui/button';
import { LoginSchema } from '../schemas/LoginSchema';
import { FormField } from '../components/FormField';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: any) => {
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
    } catch (error: any) {
      // TODO Create a toast component for feedbacks
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-card-foreground text-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            register={register}
            errors={errors}
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            register={register}
            errors={errors}
          />

          <Button type="submit" loading={isSubmitting} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
