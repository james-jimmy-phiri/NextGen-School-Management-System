import * as React from 'react';

import { cn } from '@/lib/utils';

const variantStyles: Record<'default' | 'outline' | 'ghost', string> = {
    default:
        'inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2',
    outline:
        'inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2',
    ghost: 'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100',
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
