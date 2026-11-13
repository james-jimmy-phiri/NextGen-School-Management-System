import React, { useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';
import type { PageProps } from '@/types';
import {
    Calendar, CheckCircle2, XCircle, Clock, AlertCircle,
    Users, ArrowLeft, Save, Sparkles, CheckCheck, RefreshCw
} from 'lucide-react';

const STATUSES = [
    { key: 'present', label: 'Present', activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm', inactiveClass: 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50' },
    { key: 'absent', label: 'Absent', activeClass: 'bg-rose-600 text-white border-rose-600 shadow-sm', inactiveClass: 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50' },
    { key: 'late', label: 'Late', activeClass: 'bg-amber-500 text-white border-amber-500 shadow-sm', inactiveClass: 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50' },
    { key: 'excused', label: 'Excused', activeClass: 'bg-sky-600 text-white border-sky-600 shadow-sm', inactiveClass: 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50' },
] as const;

export default function Mark({
    classes = [],
    students = [],
    existing = {},
    filters = {},
    flash
}: PageProps<{
    classes: any[];
    students: any[];
    existing: Record<string, any>;
    filters: any;
}>) {
    const initialRecords = students.map((s) => ({
        student_id: s.id,
        status: existing[s.id]?.status ?? 'present',
        notes: existing[s.id]?.notes ?? '',
    }));

    const { data, setData, post, processing } = useForm({
        class_group_id: filters.class_group_id ?? '',
        date: filters.date ?? new Date().toISOString().split('T')[0],
        records: initialRecords,
    });

    useEffect(() => {
        setData('records', students.map((s) => ({
            student_id: s.id,
            status: existing[s.id]?.status ?? 'present',
            notes: existing[s.id]?.notes ?? '',
        })));
        setData('class_group_id', filters.class_group_id ?? '');
    }, [students, filters.class_group_id]);

    const loadClass = (classId: string) => {
        router.get(route('attendance.mark'), { class_group_id: classId, date: data.date }, { preserveState: false });
    };

    const updateRecord = (index: number, field: string, value: string) => {
        const next = [...data.records];
        next[index] = { ...next[index], [field]: value };
        setData('records', next);
    };

    const markAllAs = (status: string) => {
        const next = data.records.map((r) => ({ ...r, status }));
        setData('records', next);
    };

    const summary = useMemo(() => {
        const total = data.records.length;
        const present = data.records.filter((r) => r.status === 'present').length;
        const absent = data.records.filter((r) => r.status === 'absent').length;
        const late = data.records.filter((r) => r.status === 'late').length;
        const excused = data.records.filter((r) => r.status === 'excused').length;
        return { total, present, absent, late, excused };
    }, [data.records]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('attendance.sessions.store'));
    };

    const selectedClass = classes.find((c) => String(c.id) === String(data.class_group_id));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('attendance.index')}
                            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 shadow-sm transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Mark Class Roll Call</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                    FR-013 Manual Entry
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Reconcile daily session attendance, update statuses, and trigger guardian notifications
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Mark Attendance" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">

                    {flash?.success && (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-3 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-sm">{flash.success}</span>
                        </div>
                    )}

                    {/* ─── Cohort & Date Selector Card ─────────────────────────── */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                    Target Class Group
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={data.class_group_id}
                                    onChange={(e) => loadClass(e.target.value)}
                                >
                                    <option value="">-- Choose Class Group --</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                    Roll Call Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={data.date}
                                        onChange={(e) =>
                                            router.get(
                                                route('attendance.mark'),
                                                { class_group_id: data.class_group_id, date: e.target.value },
                                                { preserveState: false }
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Bulk Actions & Live Summary Bar */}
                        {students.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
                                        Bulk Actions:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => markAllAs('present')}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        Mark All Present
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markAllAs('absent')}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all"
                                    >
                                        Mark All Absent
                                    </button>
                                </div>

                                {/* 4 Live Stat Badges (Inspiration Matrix) */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                                        Total: {summary.total}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                                        Present: {summary.present}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800">
                                        Absent: {summary.absent}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                                        Late: {summary.late}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── Student Roll Call Form ──────────────────────────────── */}
                    {!data.class_group_id ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">Select a Class Group</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Choose an academic cohort above to load enrolled students and mark daily attendance.
                            </p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">No Enrolled Students</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                No students are currently enrolled in {selectedClass?.name || 'this class'}.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Enrolled Students ({students.length})
                                    </h3>
                                    <span className="text-xs font-medium text-gray-400">
                                        Click a button to toggle attendance state
                                    </span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {students.map((s, index) => {
                                        const initials = `${s.first_name?.[0] || 'S'}${s.last_name?.[0] || ''}`;
                                        const currentStatus = data.records[index]?.status || 'present';

                                        return (
                                            <div
                                                key={s.id}
                                                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">
                                                            {s.first_name} {s.last_name}
                                                        </p>
                                                        <span className="font-mono text-xs text-gray-400">
                                                            {s.admission_number}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {STATUSES.map((st) => {
                                                        const isSelected = currentStatus === st.key;
                                                        return (
                                                            <button
                                                                key={st.key}
                                                                type="button"
                                                                onClick={() => updateRecord(index, 'status', st.key)}
                                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                                                    isSelected ? st.activeClass : st.inactiveClass
                                                                }`}
                                                            >
                                                                {st.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="p-4 sm:px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        Saving will reconcile timestamps and queue guardian SMS notifications for absent marks.
                                    </div>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="gap-2 px-6 py-2.5 rounded-xl shadow-md"
                                    >
                                        <Save className="w-4 h-4 text-emerald-400" />
                                        Save Attendance Session
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
