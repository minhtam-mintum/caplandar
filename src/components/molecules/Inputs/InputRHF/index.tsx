import type { ComponentProps, FocusEvent } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Input } from 'app/components/atoms/Input';
import { Label } from 'app/components/atoms/Label';

interface IInputRHFProps extends Omit<ComponentProps<typeof Input>, 'name'> {
  name: string;
  label?: string;
}

export function InputRHF({ name, label, onBlur, ...inputProps }: IInputRHFProps) {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });

  const { onBlur: rhfOnBlur, ...fieldProps } = register(name);
  const errorMessage = errors[name]?.message as string | undefined;
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        {...inputProps}
        {...fieldProps}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          rhfOnBlur(e);
          onBlur?.(e);
        }}
      />
      {errorMessage && <p className='text-label-sm text-error'>{errorMessage}</p>}
    </div>
  );
}
