import { forwardRef, type ComponentProps } from 'react';
import { Input } from 'app/components/atoms/Input';
import { Label } from 'app/components/atoms/Label';

interface IInputFieldProps extends ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, IInputFieldProps>(function InputField(
  { label, error, id, ...inputProps },
  ref,
) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input ref={ref} id={id} {...inputProps} />
      {error && <p className='text-label-sm text-error'>{error}</p>}
    </div>
  );
});
