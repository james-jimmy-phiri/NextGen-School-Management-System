import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type CapabilityFlags = Record<string, boolean>;

type LatestRecord = {
    id: number;
    status: string;
    student?: {
        admission_number?: string;
        first_name?: string;
        last_name?: string;
    };
    attendance_session?: {
        date?: string;
        method?: string;
        class_group?: { name?: string };
    };
};

export default function AttendanceIndex() {
    const { latest, capabilities } = usePage<
        PageProps<{
            latest: LatestRecord[];
            capabilities?: CapabilityFlags;
        }>
    >().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Smart attendance fabric</p>
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold text-slate-900">Capture & corroborate</h2>
                            <p className="text-sm text-slate-500">
                                Manual workflows ship today while QR/NFC biometric taps reuse the identical session payloads.
                            </p>
                        </div>
                        <dl className="grid gap-4 text-xs uppercase tracking-[0.3em] text-slate-400 sm:grid-cols-3">
                            <div>
                                <dt>QR conduit</dt>
                                <dd className="mt-2 text-lg font-semibold text-slate-900">
                                    {capabilities?.supports_qr ? 'provisioned' : 'roadmap'}
                                </dd>
                            </div>
                            <div>
                                <dt>NFC ready</dt>
                                <dd className="mt-2 text-lg font-semibold text-slate-900">
                                    {capabilities?.supports_nfc ? 'enabled' : 'queued'}
                                </dd>
                            </div>
                            <div>
                                <dt>Biometric</dt>
                                <dd className="mt-2 text-lg font-semibold text-slate-900">
                                    {capabilities?.supports_biometric ? 'listener up' : 'adapter slot'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            }
        >
            <Head title="Attendance workspace" />

            <div className="grid gap-6 lg:grid-cols-5">
                <section className="space-y-4 rounded-3xl border border-slate-900/10 bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/60 lg:col-span-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                        Operational brief
                    </p>
                    <h3 className="text-xl font-semibold">Session choreography</h3>
                    <p className="text-sm text-white/80">
                        Laravel queues fan out guardian SMS/e-mail stubs the moment statuses flip to absent. Offline tablets buffer raw scans, hydrate conflict-free when mesh returns, and hydrate analytics for central ministries.
                    </p>
                    <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex gap-3">
                            <span className="text-emerald-300">●</span>
                            Classroom sessions bind to academic calendars, minimizing orphan marks.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-300">●</span>
                            Auditor-grade trails via Spatie activity + custom finance hooks.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-300">●</span>
                            Flutter + Dio reuse Sanctum-provisioned bearer flows for township connectivity.
                        </li>
                    </ul>
                </section>

                <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-lg lg:col-span-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Guardian alerting</p>
                    <p className="mt-4 text-lg font-semibold">Absentee Guardian Notifier Job</p>
                    <p className="mt-3 text-sm text-emerald-900/80">
                        Each absence dispatches queued notifications with payloads ready for Airtel/TNM adapters while keeping HIPAA-style notes outside logs.
                    </p>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.4em] text-emerald-800">Queue · notifications · redis optional</p>
                </section>
            </div>

            <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-slate-100 px-8 py-6">
                    <p className="text-sm font-semibold text-slate-900">Recently reconciled punches</p>
                    <p className="text-sm text-slate-500">
                        Pulled straight from Postgres for transparent mobile/web parity.
                    </p>
                </header>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="text-left text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-8 py-4">Student</th>
                                <th className="px-8 py-4">Session</th>
                                <th className="px-8 py-4">Channel</th>
                                <th className="px-8 py-4">Disposition</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {latest.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-6 text-center text-sm text-slate-500">
                                        No attendance punches yet — seed the queues or POST to{' '}
                                        <code className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-800">
                                            /api/v1/attendance/sync
                                        </code>
                                        .
                                    </td>
                                </tr>
                            ) : (
                                latest.map((record) => (
                                    <tr key={record.id} className="text-slate-700">
                                        <td className="px-8 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {record.student?.first_name} {record.student?.last_name}
                                            </p>
                                            <p className="font-mono text-xs text-slate-500">{record.student?.admission_number}</p>
                                        </td>
                                        <td className="px-8 py-4 text-xs text-slate-600">
                                            <p>{record.attendance_session?.class_group?.name}</p>
                                            <p>{record.attendance_session?.date}</p>
                                        </td>
                                        <td className="px-8 py-4 text-xs uppercase tracking-wide">
                                            {record.attendance_session?.method}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
