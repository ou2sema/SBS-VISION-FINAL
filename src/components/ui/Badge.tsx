import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'neutral' | 'success' | 'warning' | 'danger';
}

export function Badge({
  className,
  variant = 'accent',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    accent: 'bg-[#E11D2A]/15 text-[#FF4D5A] border-[#E11D2A]/30',
    neutral: 'bg-[#161A22] text-[#9CA3AF] border-[#232934]',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide whitespace-nowrap',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
