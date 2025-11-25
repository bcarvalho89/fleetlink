import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import { Input } from './ui/input';
import { Label } from './ui/label';

interface FormFieldProps<T extends FieldValues> {
  autoComplete?: string;
  className?: string;
  errors: FieldErrors<T>;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  type?: 'text' | 'email' | 'password';
}

export const FormField = <T extends FieldValues>({
  autoComplete,
  className,
  errors,
  label,
  name,
  register,
  type = 'text',
}: FormFieldProps<T>) => {
  const error = errors[name];

  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <div className="mt-1">
        <Input
          id={name}
          type={type}
          autoComplete={autoComplete}
          {...register(name)}
        />
        {error && (
          <p className="mt-1 text-xs text-destructive">
            {String(error.message)}
          </p>
        )}
      </div>
    </div>
  );
};
