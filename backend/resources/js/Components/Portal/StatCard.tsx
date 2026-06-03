import { cn } from '@/lib/utils';
import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    sub?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendLabel?: string;
    color?: 'blue' | 'green' | 'red' | 'amber' | 'violet' | 'cyan';
    className?: string;
}

const colorMap = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        value: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    },
    green: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
        value: 'text-emerald-700 dark:text-emerald-300',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-950/30',
        icon: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        value: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
        value: 'text-amber-700 dark:text-amber-300',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    violet: {
        bg: 'bg-violet-50 dark:bg-violet-950/30',
        icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
        value: 'text-violet-700 dark:text-violet-300',
        badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    },
    cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-950/30',
        icon: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
        value: 'text-cyan-700 dark:text-cyan-300',
        badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    },
};

export default function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    trend,
    trendLabel,
    color = 'blue',
    className,
}: StatCardProps) {
    const colors = colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <span
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        colors.icon,
                    )}
                >
                    <Icon className="h-5 w-5" />
                </span>
                {trend && trendLabel && (
                    <span
                        className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                            trend === 'up' ? colors.badge : trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-muted text-muted-foreground',
                        )}
                    >
                        {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : trend === 'down' ? (
                            <TrendingDown className="h-3 w-3" />
                        ) : null}
                        {trendLabel}
                    </span>
                )}
            </div>
            <div>
                <p className={cn('text-2xl font-bold tracking-tight', colors.value)}>{value}</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
                {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
            </div>
        </motion.div>
    );
}
