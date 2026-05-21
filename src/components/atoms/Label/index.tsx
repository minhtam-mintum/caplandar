import type { LabelHTMLAttributes } from 'react';

interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = '', children, ...props }: ILabelProps) {
  return (
    <label className={`text-label-md text-on-surface-variant ${className}`} {...props}>
      {children}
    </label>
  );
}
