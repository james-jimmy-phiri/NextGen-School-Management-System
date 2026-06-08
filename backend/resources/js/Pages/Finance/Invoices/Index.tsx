import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import type { PageProps } from '@/types';
import { useState } from 'react';

export default function Index({ invoices, debtorsTotal, filters }: PageProps<{ invoices: any; debtorsTotal: number; filters: any }>) {
    const rows = invoices.data ?? invoices;
    const [search, setSearch] = useState(filters?.search ?? '');

    return (
        <AuthenticatedLayout>
            <Head title="Invoices" />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex flex-wrap justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Invoices</h1>
                        <p className="text-sm text-muted-foreground">Outstanding debtors: <strong>MWK {debtorsTotal?.toLocaleString()}</strong></p>
                    </div>
                    <Link href={route('finance.invoices.create')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        <Plus className="h-4 w-4" /> Generate invoice
                    </Link>
                </div>
                <div className="rounded-2xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Invoice #</th>
                                <th className="px-4 py-3 text-left">Student</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((inv: any) => (
                                <tr key={inv.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <Link href={route('finance.invoices.show', inv.id)} className="font-mono text-primary hover:underline">{inv.invoice_number}</Link>
                                    </td>
                                    <td className="px-4 py-3">{inv.student?.first_name} {inv.student?.last_name}</td>
                                    <td className="px-4 py-3 text-right">{Number(inv.total).toLocaleString()} {inv.currency}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{Number(inv.balance_due).toLocaleString()}</td>
                                    <td className="px-4 py-3 capitalize">{inv.status?.replace('_', ' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
