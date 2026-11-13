import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { LaravelPagination, PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Globe,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type SchoolRow = {
    id: number;
    uuid: string | null;
    name: string;
    short_name: string | null;
    slug: string;
    school_code: string | null;
    school_type: string | null;
    ownership: string | null;
    timezone: string | null;
    locale: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    district: string | null;
    country: string | null;
    currency: string | null;
    primary_color: string | null;
    is_active: boolean;
};

export default function SchoolsIndex() {
    const { schools, flash } = usePage<
        PageProps<{ schools: LaravelPagination<SchoolRow> }>
    >().props;

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredSchools = useMemo(() => {
        return (schools.data || []).filter((s) => {
            const matchesQuery =
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.slug.toLowerCase().includes(query.toLowerCase()) ||
                (s.email && s.email.toLowerCase().includes(query.toLowerCase())) ||
                (s.city && s.city.toLowerCase().includes(query.toLowerCase()));
            const matchesFilter =
                filter === 'All' ||
                (filter === 'Active' && s.is_active) ||
                (filter === 'Inactive' && !s.is_active);
            return matchesQuery && matchesFilter;
        });
    }, [schools.data, query, filter]);

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `Delete "${name}"?\n\nThis will fail if the school still has connected users, students, or campuses.`,
            )
        ) {
            router.delete(route('schools.destroy', id), { preserveScroll: true });
        }
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Slug', 'Email', 'Location', 'Status'];
        const csvRows = filteredSchools.map((s) => [
            s.id,
            `"${s.name.replace(/"/g, '""')}"`,
            s.slug,
            s.email ?? '',
            `"${[s.city, s.country].filter(Boolean).join(', ')}"`,
            s.is_active ? 'Active' : 'Inactive',
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `schools_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { label: 'Superadmin', href: '/schools' },
        { label: 'Schools & Tenants' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools & Tenants" />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Flash Banner ─────────────────────────────────────────────── */}
                {flash?.success ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                ) : null}

                {flash?.error ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                        <AlertCircle size={15} className="text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                ) : null}

                {/* ─── Page Header ─────────────────────────────────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            SUPERADMIN / MULTI-TENANCY
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            Schools &amp; Tenants <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {schools.total} {schools.total === 1 ? 'school' : 'schools'} · Multi-tenant institutional management
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
                        <Link
                            href={route('schools.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                        >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add school</span>
                        </Link>
                    </div>
                </div>

                {/* ─── Panel Container with Directory Table ─────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>Schools directory</h2>
                        <span className="record-count">{schools.total} records</span>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <div className="search-field">
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                type="text"
                                placeholder="Search schools..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="directory-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="table-scroll">
                        <table className="school-table directory-table">
                            <thead>
                                <tr>
                                    <th>School</th>
                                    <th>Slug / Code</th>
                                    <th>Timezone</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchools.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Globe size={32} className="mx-auto mb-2 opacity-30" />
                                            <p className="text-xs font-semibold">No schools found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSchools.map((s) => (
                                        <tr key={s.id}>
                                            <td>
                                                <div className="person-cell">
                                                    <span
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white shadow-2xs"
                                                        style={{
                                                            backgroundColor: s.primary_color ?? '#2563eb',
                                                        }}
                                                    >
                                                        {s.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    <div className="person-name">
                                                        <strong>{s.name}</strong>
                                                        <span>{s.short_name ? `${s.short_name} · ` : ''}{s.email || s.phone || 'No contact listed'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="class-tag">{s.slug}</span>
                                                    {s.school_code && (
                                                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{s.school_code}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-slate-600 dark:text-slate-300">
                                                {s.timezone ?? 'UTC'}
                                            </td>
                                            <td className="text-slate-600 dark:text-slate-300">
                                                {[s.city, s.country].filter(Boolean).join(', ') || '—'}
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-pill ${
                                                        s.is_active ? 'positive' : 'pending'
                                                    }`}
                                                >
                                                    <span className="status-pill-dot" />
                                                    {s.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="row-actions justify-end">
                                                    <Link
                                                        href={route('schools.edit', s.uuid ?? s.id)}
                                                        title={`Edit ${s.name}`}
                                                    >
                                                        <Pencil size={13} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(s.id, s.name)}
                                                        title={`Delete ${s.name}`}
                                                        className="action-delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {filteredSchools.length > 0 ? `1–${filteredSchools.length}` : '0'} of {schools.total} records
                        </span>
                        <div>
                            <button
                                type="button"
                                disabled={schools.current_page <= 1}
                                onClick={() =>
                                    schools.prev_page_url && router.visit(schools.prev_page_url)
                                }
                            >
                                <ChevronLeft size={13} />
                            </button>
                            <span>
                                Page {schools.current_page} of {schools.last_page}
                            </span>
                            <button
                                type="button"
                                disabled={schools.current_page >= schools.last_page}
                                onClick={() =>
                                    schools.next_page_url && router.visit(schools.next_page_url)
                                }
                            >
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="sample-footnote">
                    NextGen Platform <span>·</span> Multi-tenant Network Management
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
