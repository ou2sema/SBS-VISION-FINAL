import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] rounded-lg whitespace-nowrap';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-[#E11D2A] text-white font-semibold hover:bg-[#F02836] active:scale-[0.98] shadow-[0_0_20px_rgba(225,29,42,0.25)] hover:shadow-[0_0_25px_rgba(225,29,42,0.4)]',
      secondary:
        'bg-[#101318] text-[#FFFFFF] border border-[#232934] hover:bg-[#161A22] hover:border-[#E11D2A]/50 active:scale-[0.98]',
      outline:
        'border border-[#E11D2A] text-[#E11D2A] bg-transparent hover:bg-[#E11D2A]/10 active:scale-[0.98]',
      ghost:
        'text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#101318] active:scale-[0.98]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 shadow-sm active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0 rtl:scale-x-[-1]">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 rtl:scale-x-[-1]">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
