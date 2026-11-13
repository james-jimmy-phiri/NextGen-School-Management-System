import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserAvatar from '@/Components/UserAvatar';
import { Head, router } from '@inertiajs/react';
import {
    Users,
    Search,
    CheckCircle2,
    ShieldAlert,
    Download,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import type { PageProps } from '@/types';
import { useState } from 'react';

export default function Index({
    guardians,
    filters,
}: PageProps<{ guardians: any; filters: any }>) {
    const rows = guardians.data ?? guardians;
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Phone', 'Email', 'Children', 'Verified'];
        const csvRows = (rows || []).map((g: any) => [
            g.id,
            `"${g.first_name} ${g.last_name}"`,
            g.phone ?? '',
            g.email ?? '',
            `"${(g.students ?? []).map((s: any) => `${s.first_name} ${s.last_name}`).join(', ')}"`,
            g.verified_at ? 'Verified' : 'Unverified',
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...csvRows.map((r: any) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `guardians_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { label: 'School Management', href: '/guardians' },
        { label: 'Parents & Guardians' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Parents & Guardians" />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Page Title Header (Stitch Design) ─────────────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            SCHOOL MANAGEMENT
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            Parents &amp; Guardians <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {rows.length} {rows.length === 1 ? 'guardian' : 'guardians'} · 2026–2027 academic year
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 transition-all cursor-pointer dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted"
                        >
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* ─── Panel with Directory Table ───────────────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>Parents directory</h2>
                        <span className="record-count">{rows.length} records</span>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.get(route('guardians.index'), { search });
                            }}
                            className="search-field"
                        >
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                placeholder="Search parents by name, email, phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Table */}
                    <div className="table-scroll">
                        <table className="school-table directory-table">
                            <thead>
                                <tr>
                                    <th>Parent / Guardian</th>
                                    <th>Contact</th>
                                    <th>Enrolled Children</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            <p className="text-xs font-semibold">No parents registered</p>
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((g: any) => {
                                        const initials = `${g.first_name?.[0] ?? ''}${g.last_name?.[0] ?? ''}`.toUpperCase();

                                        return (
                                            <tr key={g.id}>
                                                <td>
                                                    <div className="person-cell">
                                                        <UserAvatar name={`${g.first_name} ${g.last_name}`} initials={initials} size="sm" />
                                                        <div className="person-name">
                                                            <strong>
                                                                {g.first_name} {g.last_name}
                                                            </strong>
                                                            <span>Parent / Guardian</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                                                        {g.phone || '—'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {g.email || 'No email registered'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                                                        {(g.students ?? []).length > 0 ? (
                                                            (g.students ?? []).map((s: any) => (
                                                                <span key={s.id} className="class-tag">
                                                                    {s.first_name} {s.last_name} ({s.admission_number})
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-400 text-xs italic">
                                                                No linked students
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`status-pill ${
                                                            g.verified_at ? 'positive' : 'pending'
                                                        }`}
                                                    >
                                                        <span className="status-pill-dot" />
                                                        {g.verified_at ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="row-actions justify-end">
                                                        {!g.verified_at ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            `Verify relationship and activate portal account for ${g.first_name} ${g.last_name}?`,
                                                                        )
                                                                    ) {
                                                                        router.post(
                                                                            route('guardians.verify', g.id),
                                                                        );
                                                                    }
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                            >
                                                                <span>Verify</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[11px] font-semibold text-emerald-600">
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {rows.length > 0 ? `1–${rows.length}` : '0'} of {rows.length} records
                        </span>
                        <div>
                            <button type="button" disabled>
                                <ChevronLeft size={13} />
                            </button>
                            <span>Page 1 of 1</span>
                            <button type="button" disabled>
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
