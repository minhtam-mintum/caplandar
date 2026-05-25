import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'app/components/atoms/Button';

interface IButtonRHFProps extends ComponentProps<typeof Button> {
  requireDirty?: boolean;
  requireValid?: boolean;
}

export function ButtonRHF({ requireDirty = true, requireValid = true, disabled, className = '', ...buttonProps }: IButtonRHFProps) {
  const {
    formState: { isValid, isDirty },
  } = useFormContext();

  const isDisabled = disabled ?? ((requireValid && !isValid) || (requireDirty && !isDirty));

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      className={`${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
    />
  );
}
