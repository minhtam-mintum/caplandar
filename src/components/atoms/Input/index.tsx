import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Input.module.scss';

type Variant = 'default' | 'filled';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(function Input(
  { variant = 'default', startAdornment, endAdornment, className = '', ...props },
  ref,
) {
  const id = useId();
  const name = props.name ?? id;
  return (
    <div className={`${styles.wrapper} ${styles[`wrapper--${variant}`]} ${className}`}>
      {startAdornment && <span className='shrink-0'>{startAdornment}</span>}
      <input ref={ref} className={styles.input} name={name} {...props} />
      {endAdornment && <span className='shrink-0'>{endAdornment}</span>}
    </div>
  );
});
