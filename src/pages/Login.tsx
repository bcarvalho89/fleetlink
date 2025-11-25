import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Input, LoadingButton } from '@/components/ui';
import { useAuth } from '@/hooks';
import { auth } from '@/lib/firebase';
import { LoginSchema } from '@/schemas/LoginSchema';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/User';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type LoginData = yup.InferType<typeof LoginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuth();

  const form = useForm<LoginData>({
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
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-input bg-card p-8 text-card-foreground shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting}
              className="w-full"
            >
              Sign in
            </LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
