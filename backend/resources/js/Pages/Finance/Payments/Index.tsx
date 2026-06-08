import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import type { PageProps } from '@/types';
import { format } from 'date-fns';

export default function Index({ payments }: PageProps<{ payments: any }>) {
    const rows = payments.data ?? payments;

    return (
        <AuthenticatedLayout>
            <Head title="Payments" />
            <div className="max-w-5xl mx-auto py-8">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <Link href={route('finance.payments.create')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        <Plus className="h-4 w-4" /> Record payment
                    </Link>
                </div>
                <div className="rounded-2xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase"><tr><th className="px-4 py-3 text-left">Receipt</th><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Date</th></tr></thead>
                        <tbody className="divide-y">
                            {rows.map((p: any) => (
                                <tr key={p.id}>
                                    <td className="px-4 py-3 font-mono">{p.reference}</td>
                                    <td className="px-4 py-3">{p.invoice?.student?.first_name} {p.invoice?.student?.last_name}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{Number(p.amount).toLocaleString()}</td>
                                    <td className="px-4 py-3 capitalize">{p.method?.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">{p.paid_at ? format(new Date(p.paid_at), 'dd/MM/yyyy') : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
