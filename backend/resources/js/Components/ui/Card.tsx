import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export function Card({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
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
    return <div className={cn('border-b border-border/60 px-6 py-4', className)}>{children}</div>;
}

export function CardTitle({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <h3 className={cn('text-base font-semibold tracking-tight text-foreground', className)}>
            {children}
        </h3>
    );
}

export function CardDescription({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}

export function CardContent({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) {
    return <div className={cn('p-6', className)}>{children}</div>;
}
