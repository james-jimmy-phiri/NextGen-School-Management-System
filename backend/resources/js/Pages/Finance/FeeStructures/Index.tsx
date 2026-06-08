import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Receipt } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Index({ structures }: PageProps<{ structures: any }>) {
    const rows = structures.data ?? structures;

    return (
        <AuthenticatedLayout>
            <Head title="Fee Structures" />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Fee Structures</h1>
                        <p className="text-sm text-muted-foreground">Configure tuition and fee components per academic year (FR-020).</p>
                    </div>
                    <Link href={route('finance.fee-structures.create')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        <Plus className="h-4 w-4" /> New structure
                    </Link>
                </div>
                <div className="rounded-2xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Academic year</th>
                                <th className="px-4 py-3 text-left">Components</th>
                                <th className="px-4 py-3 text-right">Installments</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((s: any) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-3 font-medium flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" />{s.name}</td>
                                    <td className="px-4 py-3">{s.academic_year?.title ?? '—'}</td>
                                    <td className="px-4 py-3">{(s.components ?? []).length} items</td>
                                    <td className="px-4 py-3 text-right">{s.allow_installments ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
