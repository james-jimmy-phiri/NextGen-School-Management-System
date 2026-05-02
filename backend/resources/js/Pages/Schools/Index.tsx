import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { LaravelPagination, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type SchoolRow = {
    id: number;
    name: string;
    slug: string;
    timezone: string | null;
    locale: string | null;
};

export default function SchoolsIndex() {
    const schools = usePage<PageProps<{ schools: LaravelPagination<SchoolRow> }>>().props.schools;

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        School management
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Campuses & configuration
                    </h2>
                </div>
            }
        >
            <Head title="Schools & tenants" />

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-100 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Provisioned SaaS tenants
                        </p>
                        <p className="text-sm text-slate-500">
                            Each slug maps to branded assets, Postgres isolation through{' '}
                            <code className="font-mono text-xs text-slate-700">school_id</code>.
                        </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {schools.total} records
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                <th className="px-8 py-4">School</th>
                                <th className="px-8 py-4">Timezone</th>
                                <th className="px-8 py-4">Slug</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schools.data.map((school) => (
                                <tr key={school.id} className="text-slate-700">
                                    <td className="px-8 py-4 font-semibold text-slate-900">
                                        {school.name}
                                    </td>
                                    <td className="px-8 py-4">{school.timezone}</td>
                                    <td className="px-8 py-4 font-mono text-xs">{school.slug}</td>
                                    <td className="px-8 py-4 text-right text-xs uppercase tracking-[0.2em]">
                                        Manage
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-8 py-4 text-xs text-slate-500">
                    <span>
                        Page {schools.current_page} · {schools.per_page} per view
                    </span>
                    <div className="flex gap-3">
                        {schools.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                preserveScroll
                                href={link.url ?? '#'}
                                className={`rounded-full px-3 py-1 ${
                                    link.active
                                        ? 'bg-slate-900 font-semibold text-white'
                                        : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </footer>
            </section>
        </AuthenticatedLayout>
    );
}
