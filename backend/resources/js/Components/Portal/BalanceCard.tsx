import { cn } from '@/lib/utils';

interface BalanceCardProps {
    totalFees: number;
    amountPaid: number;
    balanceDue: number;
    currency?: string;
    dueDate?: string;
    status?: 'paid' | 'partial' | 'overdue' | 'unpaid';
}

function fmt(amount: number, currency = 'MWK') {
    return `${currency} ${Number(amount).toLocaleString('en-MW', { minimumFractionDigits: 2 })}`;
}

export default function BalanceCard({
    totalFees,
    amountPaid,
    balanceDue,
    currency = 'MWK',
    dueDate,
    status = 'partial',
}: BalanceCardProps) {
    const paidPct = totalFees > 0 ? Math.min(100, Math.round((amountPaid / totalFees) * 100)) : 0;

    const statusConfig = {
        paid: { label: 'Fully Paid', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
        partial: { label: 'Partially Paid', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
        overdue: { label: 'Overdue', bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
        unpaid: { label: 'Unpaid', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    };

    const cfg = statusConfig[status];

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fee Account</p>
                    <p className={cn('mt-1 text-3xl font-bold', balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                        {fmt(balanceDue, currency)}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">Balance Due</p>
                </div>
                <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide', cfg.badge)}>
                    {cfg.label}
                </span>
            </div>

            <div className="mt-6 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{paidPct}% paid</span>
                    <span>{fmt(amountPaid, currency)} of {fmt(totalFees, currency)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
                        style={{ width: `${paidPct}%` }}
                    />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                    <p className="text-xs text-muted-foreground">Total Fees</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{fmt(totalFees, currency)}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Amount Paid</p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(amountPaid, currency)}</p>
                </div>
                {dueDate && (
                    <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Payment Due Date</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">{dueDate}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
