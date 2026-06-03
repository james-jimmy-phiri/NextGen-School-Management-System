import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

export default function SectionHeader({
    title,
    subtitle,
    backHref,
    backLabel = 'Back',
    icon: Icon,
    actions,
}: SectionHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                {backHref && (
                    <Link
                        href={backHref}
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                        title={backLabel}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                )}
                <div className="flex items-center gap-3">
                    {Icon && (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </span>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
                        {subtitle && (
                            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
