import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

type PortalStudent = {
    id: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    school?: {
        name?: string;
        branding?: Record<string, string> | null;
    };
    enrollments?: {
        status?: string;
        class_group?: { name?: string };
        academic_year?: { title?: string };
    }[];
};

export default function ParentDashboard() {
    const { students } = usePage<PageProps<{ students: PortalStudent[] }>>().props;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Guardian cockpit</p>
                    <h2 className="text-3xl font-semibold text-slate-900">Household learner lens</h2>
                    <p className="mt-3 text-sm text-slate-500">
                        Mirrors the Flutter guardian experience — attendance heatmaps, fee transparency, transcripts, messaging, and push-ready notification subscriptions.
                    </p>
                </div>
            }
        >
            <Head title="Parent workspace" />

            <div className="grid gap-6 md:grid-cols-2">
                {students.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-500 md:col-span-2">
                        No linked learners yet — ensure your guardian profile is attached to admissions.
                    </div>
                ) : (
                    students.map((student, index) => (
                        <motion.article
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
                        >
                            <header className="flex items-start justify-between gap-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                        Household roster
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                                        {student.first_name} {student.last_name}
                                    </h3>
                                    <p className="text-sm text-slate-500">{student.school?.name}</p>
                                </div>
                                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                    {student.admission_number}
                                </span>
                            </header>

                            <dl className="mt-6 grid gap-4 text-sm">
                                <div>
                                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Enrollment posture</dt>
                                    <dd className="font-semibold text-slate-900">{student.enrollments?.[0]?.status ?? 'Pending'}</dd>
                                    <dd className="text-xs text-slate-600">
                                        {student.enrollments?.[0]?.class_group?.name} ·{' '}
                                        {student.enrollments?.[0]?.academic_year?.title}
                                    </dd>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Attendance spotlight</p>
                                        <p className="mt-3 text-xl font-semibold text-slate-900">Rolling 30-day</p>
                                        <p className="text-xs text-slate-600">Consumes sanitized APIs shared with Flutter parent shell.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Fees & arrears</p>
                                        <p className="mt-3 text-xl font-semibold text-slate-900">Wallet aware</p>
                                        <p className="text-xs text-slate-600">Balances reference ledger views prepared for installments & MoMo payouts.</p>
                                    </div>
                                </div>
                            </dl>
                        </motion.article>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
