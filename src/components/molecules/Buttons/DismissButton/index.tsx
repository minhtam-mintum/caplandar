import { forwardRef, type ComponentProps } from 'react';
import { X } from 'lucide-react';
import { Button } from 'app/components/atoms/Button';

interface IDismissButtonProps extends Omit<ComponentProps<typeof Button>, 'children'> {}

export const DismissButton = forwardRef<HTMLButtonElement, IDismissButtonProps>(
  function DismissButton({ type = 'button', ...props }, ref) {
    return (
      <Button ref={ref} variant='dismiss' type={type} {...props}>
        <X size={18} />
      </Button>
    );
  },
);
