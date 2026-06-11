import type { ComponentProps, ReactNode } from 'react';
import { type FieldValues, type FormState, useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
      {isSubmitting ? (
        <span className='flex items-center gap-1.5'>
          <Loader2 size={14} className='animate-spin' />
          {render ? render(formState) : children}
        </span>
      ) : render ? render(formState) : children}
    </Button>
  );
}
