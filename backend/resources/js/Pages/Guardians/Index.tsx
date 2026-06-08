import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Users, Search } from 'lucide-react';
import type { PageProps } from '@/types';
import { useState } from 'react';

export default function Index({ guardians, filters }: PageProps<{ guardians: any; filters: any }>) {
    const rows = guardians.data ?? guardians;
    const [search, setSearch] = useState(filters?.search ?? '');

    return (
        <AuthenticatedLayout>
            <Head title="Guardians" />
            <div className="max-w-5xl mx-auto py-8">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><Users className="h-6 w-6 text-primary" /> Guardians</h1>
                <form onSubmit={e => { e.preventDefault(); router.get(route('guardians.index'), { search }); }} className="mb-4 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input className="w-full pl-9 rounded-lg border" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guardians..." />
                    </div>
                </form>
                <div className="rounded-2xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Contact</th><th className="px-4 py-3 text-left">Children</th></tr></thead>
                        <tbody className="divide-y">
                            {rows.map((g: any) => (
                                <tr key={g.id}>
                                    <td className="px-4 py-3 font-medium">{g.first_name} {g.last_name}</td>
                                    <td className="px-4 py-3">{g.phone}<br /><span className="text-muted-foreground text-xs">{g.email}</span></td>
                                    <td className="px-4 py-3">{(g.students ?? []).map((s: any) => `${s.first_name} ${s.last_name}`).join(', ') || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
