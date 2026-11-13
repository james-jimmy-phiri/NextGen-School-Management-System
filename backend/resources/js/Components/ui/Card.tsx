import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export function Card({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={cn(
                'rounded-lg border border-slate-300/90 bg-white text-slate-900 shadow-sm',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return <div className={cn('border-b border-slate-200 px-6 py-4', className)}>{children}</div>;
}

export function CardTitle({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <h3 className={cn('text-base font-semibold tracking-tight text-slate-900', className)}>
            {children}
        </h3>
    );
}

export function CardDescription({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return <p className={cn('text-sm text-slate-500', className)}>{children}</p>;
}

export function CardContent({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return <div className={cn('p-6', className)}>{children}</div>;
}
