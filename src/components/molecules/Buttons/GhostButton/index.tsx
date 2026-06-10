import { forwardRef, type ComponentProps } from 'react';
import { Button } from 'app/components/atoms/Button';

interface IGhostButtonProps extends ComponentProps<typeof Button> {}

export const GhostButton = forwardRef<HTMLButtonElement, IGhostButtonProps>(
  function GhostButton(props, ref) {
    return <Button ref={ref} variant='ghost' {...props} type='button' />;
  },
);
