import { forwardRef, type ComponentProps } from 'react';
import { Button } from 'app/components/atoms/Button';

interface IButtonFieldProps extends ComponentProps<typeof Button> {}

export const ButtonField = forwardRef<HTMLButtonElement, IButtonFieldProps>(
  function ButtonField(props, ref) {
    return <Button ref={ref} {...props} />;
  },
);
