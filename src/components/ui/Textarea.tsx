import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold tracking-wide text-[#FFFFFF]/90"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-[#08090C] text-[#FFFFFF] border border-[#232934] rounded-lg p-3 text-sm transition-all duration-150 placeholder:text-[#6B7280] focus:border-[#E11D2A] focus:ring-1 focus:ring-[#E11D2A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-[#9CA3AF]">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
