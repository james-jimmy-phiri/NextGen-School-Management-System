import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

type AttendanceSnapshot = {
    date?: string;
    present?: number;
};

type DashboardAnalytics = {
    scope: string;
    metrics: {
        students: number;
        staff: number;
        open_invoices: number;
        attendance_today?: {
            total?: number;
            absent?: number;
            late?: number;
        };
        recent_announcements: number;
    };
    trends?: {
        attendance_week?: AttendanceSnapshot[];
        grade_updates?: number;
    };
};

export default function Dashboard() {
    const { analytics } = usePage<PageProps<{ analytics: DashboardAnalytics }>>()
        .props;

    const metricCards = [
        {
            label: 'Active learners',
            value: analytics.metrics.students,
            hint: 'Admission pipeline & transfers roll up here in later sprints.',
        },
        {
            label: 'Licensed staff',
            value: analytics.metrics.staff,
            hint: 'Teachers, administrators, and finance seats.',
        },
        {
            label: 'Open receivables',
            value: analytics.metrics.open_invoices,
            hint: 'Installment plans, mobile money, and bank feeds converge in finance.',
        },
        {
            label: 'Attendance pulse (today)',
            value: analytics.metrics.attendance_today
                ? `${Math.max(
                      0,
                      (analytics.metrics.attendance_today.total ?? 0) -
                          (analytics.metrics.attendance_today.absent ?? 0),
                  )} present · ${
                      analytics.metrics.attendance_today.absent ?? 0
                  } absent`
                : 'Awaiting first check-in',
            hint: 'Designed for manual, QR, biometric, and NFC capture.',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        Operational intelligence
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Tenant overview
                    </h2>
                    <p className="text-sm text-slate-500">
                        Scoped to{' '}
                        <span className="font-semibold text-slate-800">
                            {analytics.scope === 'platform'
                                ? 'multi-school platform view'
                                : 'your active school context'}
                        </span>{' '}
                        with offline-ready services for rural connectivity.
                    </p>
                </div>
            }
        >
            <Head title="Command center" />

            <div className="space-y-10 py-10">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((card, index) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {card.label}
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">
                                {card.value}
                            </p>
                            <p className="mt-4 text-xs text-slate-500">
                                {card.hint}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-5">
                    <div className="lg:col-span-3 space-y-6">
                        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Weekly attendance trend
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Normalized for class group session
                                        validation.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {(analytics.trends?.attendance_week ?? []).map(
                                    (row) => (
                                        <div key={row.date}>
                                            <div className="flex items-center justify-between text-xs uppercase text-slate-500">
                                                <span>{row.date}</span>
                                                <span>{row.present ?? 0}</span>
                                            </div>
                                            <div className="mt-2 h-2 rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-emerald-400"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            (row.present ??
                                                                0) * 10,
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                                {analytics.trends?.attendance_week?.length ===
                                    0 && (
                                    <p className="text-sm text-slate-500">
                                        No attendance sessions yet for this
                                        school. Start with the Attendance
                                        workspace.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-dashed border-emerald-300/60 bg-emerald-50/40 p-6 text-sm text-emerald-900">
                            <p className="font-semibold">Offline readiness</p>
                            <p className="mt-2 text-emerald-900/80">
                                Attendance, academics, and guardian messaging
                                are architected for field sync: mobile clients
                                hydrate from cached copies, reconcile with
                                conflict clocks, and hydrate PDFs when back
                                online.
                            </p>
                        </section>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-slate-900">
                                Grading & transcripts
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {analytics.trends?.grade_updates ?? 0}
                            </p>
                            <p className="text-xs text-slate-500">
                                Assessment events processed in the trailing
                                audit window.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li>Weighted GPA with multi-term rollups.</li>
                                <li>Printable report cards + PDF exports.</li>
                                <li>Rankings with anonymized benchmarks.</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl bg-slate-900 p-6 text-sm text-slate-50 shadow-lg">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                Parent & community layer
                            </p>
                            <p className="mt-3 text-base font-semibold">
                                Multi-child households, fee transparency, and
                                secure chat with homeroom tutors.
                            </p>
                            <p className="mt-3 text-slate-400">
                                Announcement fan-out:{' '}
                                <span className="text-white">
                                    {
                                        analytics.metrics.recent_announcements
                                    }
                                </span>{' '}
                                live templates ready for SMS/e-mail/push
                                bridges.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
