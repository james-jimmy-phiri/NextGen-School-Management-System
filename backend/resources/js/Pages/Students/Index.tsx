import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { LaravelPagination, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type EnrollmentSummary = {
    class_group?: { name?: string };
    academic_year?: { title?: string };
};

type StudentRow = {
    id: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    status: string | null;
    enrollments?: EnrollmentSummary[];
};

export default function StudentsIndex() {
    const students = usePage<PageProps<{ students: LaravelPagination<StudentRow> }>>().props.students;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Student Information System
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">Admissions cockpit</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Guardian graph, learner health profile, ledger balances, and performance rollups hydrate from the same Postgres records exposed to Flutter field apps.
                    </p>
                </div>
            }
        >
            <Head title="Students" />

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-4 border-b border-slate-100 px-8 py-6 text-sm md:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <p className="text-xs uppercase tracking-wide text-emerald-900/70">Enrollment health</p>
                        <p className="mt-3 text-lg font-semibold text-emerald-900">Live sync-ready</p>
                        <p className="mt-2 text-xs text-emerald-900/80">
                            Admissions, promotions, transfers, and document vaults converge on audited activity logs with Spatie.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Search & facets</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">API + Inertia parity</p>
                        <p className="mt-2 text-xs text-slate-600">
                            Identical Laravel services back `/api/v1/students` and this workspace for zero drift.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-indigo-600">Finance bridge</p>
                        <p className="mt-3 text-lg font-semibold text-indigo-950">Balances follow learners</p>
                        <p className="mt-2 text-xs text-indigo-900/80">
                            Invoices inherit fee structures prepared for TNM Mpamba, Airtel Money, bank APIs, or cash windows.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-8 py-4">Admission #</th>
                                <th className="px-8 py-4">Student</th>
                                <th className="px-8 py-4">Class</th>
                                <th className="px-8 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.data.map((student) => {
                                const enrollment = student.enrollments?.[0];

                                return (
                                    <tr key={student.id} className="text-slate-700">
                                        <td className="px-8 py-4 font-mono text-xs font-semibold text-slate-900">
                                            {student.admission_number}
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {student.first_name} {student.last_name}
                                            </p>
                                            <p className="text-xs text-slate-500">Medical + guardian dossier ready</p>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-600">
                                            {enrollment?.class_group?.name ?? 'Unassigned'}{' '}
                                            <span className="text-xs text-slate-400">
                                                ({enrollment?.academic_year?.title ?? '—'})
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <footer className="flex flex-wrap gap-4 border-t border-slate-100 px-8 py-4 text-xs text-slate-500">
                    <span>
                        Showing {students.data.length} of {students.total} cohort members
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {students.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? '#'}
                                preserveScroll
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
