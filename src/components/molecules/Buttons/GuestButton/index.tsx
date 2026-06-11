import { forwardRef, type ComponentProps } from 'react';
import { Button } from 'app/components/atoms/Button';

interface IGuestButtonProps extends Omit<ComponentProps<typeof Button>, 'variant' | 'children'> {}

export const GuestButton = forwardRef<HTMLButtonElement, IGuestButtonProps>(
  function GuestButton(props, ref) {
    return (
      <Button ref={ref} variant='incognito' type='button' {...props}>
        <span className='font-mono text-sm font-bold tracking-widest'>INCOGNITO</span>
        <span className='text-body-sm'>Join Anonymously</span>
      </Button>
    );
  },
);
