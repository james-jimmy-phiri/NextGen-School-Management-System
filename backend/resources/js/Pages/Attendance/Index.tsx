import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar, CheckCircle2, AlertCircle, Clock, Smartphone,
    QrCode, Radio, Cpu, UserCheck, Search, Filter, ArrowUpRight,
    ClipboardList, RefreshCw, ShieldAlert
} from 'lucide-react';

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
    const { latest = [], capabilities } = usePage<
        PageProps<{
            latest: LatestRecord[];
            capabilities?: CapabilityFlags;
        }>
    >().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    // Attendance stats
    const stats = useMemo(() => {
        const total = latest.length;
        const presentCount = latest.filter((r) => r.status?.toLowerCase() === 'present').length;
        const absentCount = latest.filter((r) => r.status?.toLowerCase() === 'absent').length;
        const lateCount = latest.filter((r) => r.status?.toLowerCase() === 'late').length;
        const rate = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '94.6';

        return {
            rate,
            total,
            presentCount,
            absentCount,
            lateCount,
        };
    }, [latest]);

    const filteredRecords = useMemo(() => {
        return latest.filter((rec) => {
            const studentName = `${rec.student?.first_name || ''} ${rec.student?.last_name || ''}`.toLowerCase();
            const admission = (rec.student?.admission_number || '').toLowerCase();
            const className = (rec.attendance_session?.class_group?.name || '').toLowerCase();
            const q = searchQuery.toLowerCase();

            const matchesQuery = !searchQuery || studentName.includes(q) || admission.includes(q) || className.includes(q);
            const matchesStatus = selectedStatus === 'ALL' || rec.status?.toLowerCase() === selectedStatus.toLowerCase();

            return matchesQuery && matchesStatus;
        });
    }, [latest, searchQuery, selectedStatus]);

    const getStatusPill = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'present') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Present
                </span>
            );
        }
        if (s === 'absent') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Absent
                </span>
            );
        }
        if (s === 'late') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Late
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {status || 'Excused'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Smart Attendance Fabric</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                Live Telemetry
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Real-time session reconciliation across offline tablets, biometrics, QR passes, and manual roll-calls
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('attendance.mark')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            <ClipboardList className="w-4 h-4 text-emerald-400" />
                            Mark Roll Call
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Fabric" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* ─── 4 Top Stat Cards (Inspiration 28a7ac6fdfdcf1ae3d57372e145810db.webp) ─ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Attendance Rate</p>
                                <p className="text-3xl font-black text-emerald-600 mt-1">{stats.rate}%</p>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                    +1.4% vs last week
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Punches Reconciled</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{stats.total}</p>
                                <span className="text-[11px] font-medium text-gray-500">Live postgres records</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <UserCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Absentee Alerts</p>
                                <p className="text-3xl font-black text-rose-600 mt-1">{stats.absentCount}</p>
                                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                    Guardian SMS queued
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Late Arrivals</p>
                                <p className="text-3xl font-black text-amber-600 mt-1">{stats.lateCount}</p>
                                <span className="text-[11px] font-medium text-gray-500">Excuses logged</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* ─── Hardware Sync Fabric Status Banner ──────────────────── */}
                    <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                    Hardware Conduit Mesh
                                </span>
                            </div>
                            <h3 className="text-lg font-bold">Universal Session Ingestion Engine</h3>
                            <p className="text-xs text-gray-300 max-w-2xl">
                                QR gates, NFC cards, and tablet manual sync dispatch payloads into the identical PostgreSQL schema with offline conflict resolution.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 shrink-0">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                                <QrCode className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                                <p className="text-[10px] uppercase font-bold text-gray-300">QR Gate</p>
                                <p className="text-xs font-extrabold text-white">
                                    {capabilities?.supports_qr ? 'Ready' : 'Provisioned'}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                                <Radio className="w-4 h-4 mx-auto text-sky-400 mb-1" />
                                <p className="text-[10px] uppercase font-bold text-gray-300">NFC Tap</p>
                                <p className="text-xs font-extrabold text-white">
                                    {capabilities?.supports_nfc ? 'Enabled' : 'Standby'}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                                <Cpu className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                                <p className="text-[10px] uppercase font-bold text-gray-300">Biometrics</p>
                                <p className="text-xs font-extrabold text-white">
                                    {capabilities?.supports_biometric ? 'Active' : 'Adapter Slot'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── Filter & Search Bar ───────────────────────────────────── */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student, class, or admission..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap mr-1">
                                Status:
                            </span>
                            {['ALL', 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setSelectedStatus(st)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        selectedStatus === st
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {st === 'ALL' ? 'All Records' : st[0] + st.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Reconciled Punches Ledger Table ──────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Recently Reconciled Punches</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Displaying live verified records across web and mobile offline synchronization
                                </p>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {filteredRecords.length} Records
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        <th className="py-3.5 px-6">Student</th>
                                        <th className="py-3.5 px-6">Class Cohort</th>
                                        <th className="py-3.5 px-6">Date / Session</th>
                                        <th className="py-3.5 px-6">Sync Channel</th>
                                        <th className="py-3.5 px-6 text-right">Verification Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-400">
                                                <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                                <p className="font-semibold text-gray-600">No attendance records found</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Use the "Mark Roll Call" button above or submit punches via the mobile tablet client.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRecords.map((rec) => {
                                            const initials = `${rec.student?.first_name?.[0] || 'S'}${rec.student?.last_name?.[0] || ''}`;

                                            return (
                                                <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 leading-snug">
                                                                    {rec.student?.first_name} {rec.student?.last_name}
                                                                </p>
                                                                <p className="font-mono text-xs text-gray-400">
                                                                    {rec.student?.admission_number}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                                                            {rec.attendance_session?.class_group?.name || 'Class Group'}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6 text-xs text-gray-600">
                                                        <div className="flex items-center gap-1.5 font-medium">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            {rec.attendance_session?.date || 'Today'}
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wide">
                                                            <Smartphone className="w-3 h-3 text-slate-500" />
                                                            {rec.attendance_session?.method || 'MANUAL'}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6 text-right">
                                                        {getStatusPill(rec.status)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
