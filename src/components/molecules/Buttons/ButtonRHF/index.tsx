import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'app/components/atoms/Button';

interface IButtonRHFProps extends ComponentProps<typeof Button> {}

export function ButtonRHF({ disabled, className = '', ...buttonProps }: IButtonRHFProps) {
  const {
    formState: { isValid, isDirty },
  } = useFormContext();

  const isDisabled = disabled ?? (!isValid || !isDirty);

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      className={`${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
    />
  );
}
