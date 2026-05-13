import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

const variants = {
    default: 'border-transparent bg-primary/10 text-primary',
    secondary: 'border-transparent bg-muted text-muted-foreground',
    outline: 'border-border bg-background text-foreground',
    success: 'border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    warning: 'border-transparent bg-amber-500/10 text-amber-800 dark:text-amber-300',
};

export function Badge({
    className,
    variant = 'default',
    children,
}: PropsWithChildren<{
    className?: string;
    variant?: keyof typeof variants;
}>) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                variants[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
