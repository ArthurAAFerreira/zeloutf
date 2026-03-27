import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'secondary', className, children, ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsx(
        'rounded-xl px-4 py-2 font-medium transition',
        variant === 'primary'
          ? 'bg-brand-dark text-brand-yellow hover:opacity-90'
          : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
