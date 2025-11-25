import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface FormFieldProps {
  autoComplete?: string;
  className?: string;
  errors: FieldErrors;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  type?: 'text' | 'email' | 'password';
}

export const FormField = ({
  autoComplete,
  className,
  errors,
  label,
  name,
  register,
  type = 'text',
}: FormFieldProps) => {
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
