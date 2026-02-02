import type { TailngButtonSize, TailngButtonVariant } from './button.types';

const base =
  'inline-flex items-center justify-center gap-2 font-medium select-none ' +
  'transition-colors ' +
  'focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-primary ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<TailngButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded',
  md: 'h-10 px-4 text-sm rounded-md',
  lg: 'h-12 px-5 text-base rounded-lg',
};

const variants: Record<TailngButtonVariant, string> = {
  solid:
    'bg-primary text-on-primary hover:bg-primary-hover',

  outline:
    'border border-border text-fg bg-bg ' +
    'hover:bg-alternate-background',

  ghost:
    'text-fg hover:bg-alternate-background',
};

export const buttonClasses = (
  variant: TailngButtonVariant,
  size: TailngButtonSize,
  opts?: { block?: boolean }
) =>
  [
    base,
    sizes[size],
    variants[variant],
    opts?.block ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');
