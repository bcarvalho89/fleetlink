import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, LoadingButton } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { LoginSchema } from '../schema/LoginSchema';

export type LoginData = yup.InferType<typeof LoginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const form = useForm<LoginData>({
    resolver: yupResolver(LoginSchema),
  });

  return (
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
  );
};
