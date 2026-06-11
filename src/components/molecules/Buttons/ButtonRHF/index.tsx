import type { ComponentProps, ReactNode } from 'react';
import { type FieldValues, type FormState, useFormContext } from 'react-hook-form';
import { Button } from 'app/components/atoms/Button';

interface IButtonRHFProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  children?: ReactNode;
  render?: (formState: FormState<FieldValues>) => ReactNode;
}

export function ButtonRHF({ disabled, className = '', render, children, ...buttonProps }: IButtonRHFProps) {
  const { formState } = useFormContext();
  const { isValid, isDirty, isSubmitting } = formState;

  const isDisabled = disabled ?? (!isValid || !isDirty || isSubmitting);

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      className={`${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {render ? render(formState) : children}
    </Button>
  );
}
