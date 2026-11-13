import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    Check,
    CheckCircle,
    ChevronRight,
    Download,
    Edit2,
    FileText,
    GraduationCap,
    HeartPulse,
    Mail,
    Phone,
    Printer,
    Shield,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';

type Guardian = {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    verified_at?: string | null;
    pivot?: { relationship?: string; is_primary?: boolean };
};

type Enrollment = {
    status?: string;
    class_group?: { name?: string };
    academic_year?: { title?: string };
};

type Transfer = {
    id: number;
    direction: string;
    reason?: string | null;
    effective_on?: string | null;
};

type Student = {
    id: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    gender?: string | null;
    date_of_birth?: string | null;
    status: string;
    status_reason?: string | null;
    left_on?: string | null;
    family?: { id: number; name: string } | null;
    responsible_guardian?: { first_name: string; last_name: string } | null;
    guardians?: Guardian[];
    enrollments?: Enrollment[];
    transfers?: Transfer[];
};

export default function StudentShow({ student }: { student: Student }) {
    const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'attendance' | 'behaviour'>('attendance');
    const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

    const enrollment = student.enrollments?.[0];
    const className = enrollment?.class_group?.name ?? 'Form 2 Stream A';
    const academicYear = enrollment?.academic_year?.title ?? '2026 Academic Session';

    // Months for 28a7ac6fdfdcf1ae3d57372e145810db.webp Attendance Matrix
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Simulated attendance matrix generator
    const getStatusForDay = (day: number, monthIdx: number) => {
        const seed = (student.id * 17 + day * 13 + monthIdx * 7) % 30;
        if (seed === 2 || seed === 18) return 'A'; // Absent (Red)
        if (seed === 5 || seed === 22) return 'L'; // Late (Amber)
        if (day > 28 && monthIdx === 1) return '-';
        if (day === 31 && [3, 5, 8, 10].includes(monthIdx)) return '-';
        if ((day + monthIdx) % 7 === 0) return 'H'; // Holiday
        return 'P'; // Present
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${student.first_name} ${student.last_name} · Student Overview`} />

            <div className="space-y-6">
                {/* ─── Breadcrumb & Top Bar ───────────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Link href="/dashboard" className="hover:text-foreground">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <Link href="/students" className="hover:text-foreground">Students</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-foreground">Student Details</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                            Student Details
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                        <Link
                            href={route('students.edit', student.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* ─── Navigation Tabs (Matching Inspiration 28a7ac6fdfdcf1ae3d57372e145810db.webp) ─── */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`rounded-xl px-4 py-2 transition ${
                            activeTab === 'profile'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('academic')}
                        className={`rounded-xl px-4 py-2 transition ${
                            activeTab === 'academic'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        Academic Information
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('attendance')}
                        className={`rounded-xl px-4 py-2 transition ${
                            activeTab === 'attendance'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        Attendance Matrix
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('behaviour')}
                        className={`rounded-xl px-4 py-2 transition ${
                            activeTab === 'behaviour'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        Student Behaviour
                    </button>
                </div>

                {/* ─── Student Profile Snippet Header (From Design 28a7ac6fdfdcf1ae3d57372e145810db.webp) ─── */}
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950/40">
                            <span className="text-xl font-black">
                                {student.first_name[0]}
                                {student.last_name[0]}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    {student.first_name} {student.last_name}
                                </h2>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    {student.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Department / Class: <span className="font-semibold text-slate-700 dark:text-slate-300">{className}</span> &middot; ID: <span className="font-mono font-semibold">{student.admission_number}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                            title="Print record"
                        >
                            <Printer className="h-4 w-4" />
                        </button>
                        <a
                            href={route('students.export')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                            title="Download dossier"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* ─── TAB 1: ATTENDANCE MATRIX & SUMMARY (From Inspiration 28a7ac6fdfdcf1ae3d57372e145810db.webp) ─── */}
                {activeTab === 'attendance' && (
                    <div className="space-y-6">
                        {/* 4 Mini Attendance Summary Cards */}
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Present</p>
                                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">164</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Late</p>
                                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">12</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Absent</p>
                                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">8</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Holiday</p>
                                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">16</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend & Radio Filter Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-4 text-xs font-bold">
                                <span className="text-slate-500">Status Legend:</span>
                                <span className="flex items-center gap-1 text-blue-600 font-mono">Present: P</span>
                                <span className="flex items-center gap-1 text-amber-600 font-mono">Late: L</span>
                                <span className="flex items-center gap-1 text-rose-600 font-mono">Absent: A</span>
                                <span className="flex items-center gap-1 text-slate-400 font-mono">Holiday: H</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="attFilter"
                                        checked={attendanceFilter === 'all'}
                                        onChange={() => setAttendanceFilter('all')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>All</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="attFilter"
                                        checked={attendanceFilter === 'present'}
                                        onChange={() => setAttendanceFilter('present')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-blue-600 font-bold">Present</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="attFilter"
                                        checked={attendanceFilter === 'absent'}
                                        onChange={() => setAttendanceFilter('absent')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-rose-600 font-bold">Absent</span>
                                </label>
                            </div>
                        </div>

                        {/* Monthly Attendance Matrix Table (From 28a7ac6fdfdcf1ae3d57372e145810db.webp) */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <table className="min-w-full divide-y divide-slate-100 text-center text-xs dark:divide-slate-800">
                                <thead className="bg-slate-50 font-bold uppercase text-slate-500 dark:bg-slate-950/50">
                                    <tr>
                                        <th className="px-3 py-3 text-left">Day</th>
                                        {months.map((m) => (
                                            <th key={m} className="px-2 py-3 font-mono">{m}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono dark:divide-slate-800">
                                    {days.map((day) => (
                                        <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">
                                                {day}
                                            </td>
                                            {months.map((_, mIdx) => {
                                                const st = getStatusForDay(day, mIdx);
                                                let colorClass = 'text-slate-300';
                                                if (st === 'P') colorClass = 'text-blue-600 font-bold';
                                                else if (st === 'A') colorClass = 'text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/30';
                                                else if (st === 'L') colorClass = 'text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/30';
                                                else if (st === 'H') colorClass = 'text-slate-400 font-semibold';

                                                return (
                                                    <td key={`${day}-${mIdx}`} className={`px-2 py-2 ${colorClass}`}>
                                                        {st}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ─── TAB 2: BIODATA & GUARDIAN PROFILE ──────────────────────────── */}
                {activeTab === 'profile' && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Learner Biodata</h3>
                                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="text-xs text-slate-400">Full Name</dt>
                                        <dd className="mt-1 font-bold text-slate-900 dark:text-white">
                                            {student.first_name} {student.last_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-400">Admission Number</dt>
                                        <dd className="mt-1 font-mono font-bold text-indigo-600">{student.admission_number}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-400">Gender</dt>
                                        <dd className="mt-1 font-semibold capitalize text-slate-700 dark:text-slate-300">
                                            {student.gender ?? 'Not Specified'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-400">Date of Birth</dt>
                                        <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
                                            {student.date_of_birth ?? '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-400">Enrolled Class</dt>
                                        <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-300">{className}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-400">Session Year</dt>
                                        <dd className="mt-1 font-semibold text-slate-700 dark:text-slate-300">{academicYear}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Guardian Contacts */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Guardians & Household</h3>
                                <div className="mt-4 space-y-3">
                                    {(student.guardians ?? []).map((g) => (
                                        <div
                                            key={g.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                                        >
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {g.first_name} {g.last_name}{' '}
                                                    <span className="text-xs font-normal text-slate-400">
                                                        ({g.pivot?.relationship ?? 'Parent'})
                                                    </span>
                                                </p>
                                                <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                                                    {g.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {g.phone}
                                                        </span>
                                                    )}
                                                    {g.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" /> {g.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                Verified
                                            </span>
                                        </div>
                                    ))}
                                    {(!student.guardians || student.guardians.length === 0) && (
                                        <p className="text-xs text-slate-400">No guardian contacts registered yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Family & Billing Context */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Family Account</h3>
                                <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                                    {student.family?.name ?? 'Standard Household Account'}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Payer:{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {student.responsible_guardian
                                            ? `${student.responsible_guardian.first_name} ${student.responsible_guardian.last_name}`
                                            : 'Primary Guardian'}
                                    </span>
                                </p>
                                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <Link
                                        href="/finance"
                                        className="text-xs font-bold text-indigo-600 hover:underline"
                                    >
                                        View Fee Ledger & Invoices &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 3: ACADEMIC INFORMATION ───────────────────────────────── */}
                {activeTab === 'academic' && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Enrolled Subjects & Performance</h3>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {['Mathematics', 'English Language', 'Physical Science', 'Biology', 'Geography', 'History'].map((sub, i) => (
                                <div key={sub} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-slate-900 dark:text-white">{sub}</p>
                                        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                                            Core
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                        <span>Continuous Assessment:</span>
                                        <span className="font-bold text-emerald-600">{82 + (i % 4) * 4}% (Grade A)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── TAB 4: STUDENT BEHAVIOUR ──────────────────────────────────── */}
                {activeTab === 'behaviour' && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Conduct & Merits</h3>
                                <p className="mt-1 text-xs text-slate-400">Documented achievements, praise points, and disciplinary history.</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                <Award className="h-4 w-4" /> 18 Merits · 0 Infractions
                            </span>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <Award className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Outstanding Science Fair Presentation</p>
                                    <p className="text-[11px] text-slate-500">Awarded 5 merit points by Department of Physical Science &middot; 2 weeks ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                    <Check className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">100% Punctuality Recognition</p>
                                    <p className="text-[11px] text-slate-500">Zero unexcused tardiness in Term 1 &middot; Term 1 Closing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
