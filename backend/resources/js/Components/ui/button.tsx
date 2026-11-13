import * as React from 'react';

import { cn } from '@/lib/utils';

const variantStyles: Record<'default' | 'primary' | 'outline' | 'ghost', string> = {
    default:
        'inline-flex items-center justify-center rounded-md bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] active:bg-[#1e40af] border border-blue-600 hover:border-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
    primary:
        'inline-flex items-center justify-center rounded-md bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] active:bg-[#1e40af] border border-blue-600 hover:border-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
    outline:
        'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
    ghost:
        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all',
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variantStyles;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', type = 'button', ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={cn(variantStyles[variant], className)}
                {...props}
            />
        );
    },
);

Button.displayName = 'Button';
