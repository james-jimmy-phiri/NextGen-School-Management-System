import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { format } from 'date-fns';

export default function Show({ invoice, flash }: PageProps<{ invoice: any }>) {
    return (
        <AuthenticatedLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="max-w-3xl mx-auto py-8">
                <Link href={route('finance.invoices.index')} className="text-sm text-primary hover:underline">← Invoices</Link>
                {flash?.success && <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-800 p-3 text-sm">{flash.success}</div>}
                <div className="mt-4 rounded-2xl border bg-card p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold font-mono">{invoice.invoice_number}</h1>
                            <p className="text-sm text-muted-foreground">{invoice.student?.first_name} {invoice.student?.last_name} · {invoice.student?.admission_number}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{invoice.status}</span>
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{Number(invoice.total).toLocaleString()} {invoice.currency}</dd></div>
                        <div><dt className="text-muted-foreground">Balance due</dt><dd className="font-semibold text-rose-600">{Number(invoice.balance_due).toLocaleString()}</dd></div>
                        <div><dt className="text-muted-foreground">Due date</dt><dd>{invoice.due_date ? format(new Date(invoice.due_date), 'dd/MM/yyyy') : '—'}</dd></div>
                    </dl>
                    {invoice.balance_due > 0 && (
                        <Link href={`${route('finance.payments.create')}?invoice=${invoice.id}`} className="mt-6 inline-block">
                            <PrimaryButton>Record payment</PrimaryButton>
                        </Link>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
