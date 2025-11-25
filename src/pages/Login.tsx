import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { FormField } from '../components/FormField';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import { LoginSchema } from '../schemas/LoginSchema';
import { useAuthStore } from '../store/auth';
import { User } from '../types/User';

type LoginData = yup.InferType<typeof LoginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: yupResolver(LoginSchema),
  });

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
      // TODO Create a toast component for feedbacks
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred during login.');
      }
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
