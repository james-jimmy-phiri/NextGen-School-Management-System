import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { LaravelPagination, PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Globe, Pencil, PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type SchoolRow = {
    id: number;
    name: string;
    slug: string;
    timezone: string | null;
    locale: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    currency: string | null;
    primary_color: string | null;
    is_active: boolean;
};

export default function SchoolsIndex() {
    const { schools, flash } = usePage<
        PageProps<{ schools: LaravelPagination<SchoolRow> }>
    >().props;

    const [flashMsg, setFlashMsg] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setFlashMsg({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setFlashMsg({ type: 'error', text: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        if (!flashMsg) return;
        const timer = setTimeout(() => setFlashMsg(null), 4500);
        return () => clearTimeout(timer);
    }, [flashMsg]);

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `Delete "${name}"?\n\nThis will fail if the school still has connected users, students, or campuses.`,
            )
        ) {
            router.delete(route('schools.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Super admin
                        </p>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Schools &amp; Tenants
                        </h2>
                    </div>
                    <Link
                        href={route('schools.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                        <PlusCircle className="h-4 w-4" />
                        New school
                    </Link>
                </div>
            }
        >
            <Head title="Schools & Tenants" />

            {/* Flash notification */}
            {flashMsg && (
                <div
                    className={`mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium shadow-sm ${
                        flashMsg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                            : 'bg-red-50 text-red-800 ring-1 ring-red-200'
                    }`}
                >
                    {flashMsg.type === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <span>{flashMsg.text}</span>
                    <button
                        type="button"
                        onClick={() => setFlashMsg(null)}
                        className="ml-auto shrink-0 text-xs underline opacity-70 hover:opacity-100"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-slate-100 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Provisioned SaaS tenants
                        </p>
                        <p className="text-sm text-slate-500">
                            Each slug maps to branded assets and data isolation through{' '}
                            <code className="font-mono text-xs text-slate-700">school_id</code>.
                        </p>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                        {schools.total} {schools.total === 1 ? 'record' : 'records'}
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                <th className="px-8 py-4">School</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Timezone</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schools.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-8 py-16 text-center text-slate-400"
                                    >
                                        <Globe className="mx-auto mb-3 h-10 w-10 opacity-30" />
                                        <p className="text-sm font-medium">No schools yet</p>
                                        <p className="mt-1 text-xs">
                                            Create the first tenant to get started.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                schools.data.map((school) => (
                                    <tr
                                        key={school.id}
                                        className="group text-slate-700 transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Color swatch */}
                                                <span
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
                                                    style={{
                                                        backgroundColor:
                                                            school.primary_color ?? '#0f172a',
                                                    }}
                                                >
                                                    {school.name.charAt(0).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-900">
                                                        {school.name}
                                                    </p>
                                                    {school.email && (
                                                        <p className="truncate text-xs text-slate-400">
                                                            {school.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                                                {school.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {school.timezone ?? '—'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {[school.city, school.country]
                                                .filter(Boolean)
                                                .join(', ') || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    school.is_active
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        school.is_active
                                                            ? 'bg-emerald-500'
                                                            : 'bg-slate-400'
                                                    }`}
                                                />
                                                {school.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('schools.edit', school.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(school.id, school.name)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
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
                {schools.last_page > 1 && (
                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-8 py-4 text-xs text-slate-500">
                        <span>
                            Page {schools.current_page} of {schools.last_page} &middot;{' '}
                            {schools.per_page} per page
                        </span>
                        <div className="flex gap-2">
                            {schools.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    preserveScroll
                                    href={link.url ?? '#'}
                                    className={`rounded-full px-3 py-1 ${
                                        link.active
                                            ? 'bg-slate-900 font-semibold text-white'
                                            : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </footer>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
