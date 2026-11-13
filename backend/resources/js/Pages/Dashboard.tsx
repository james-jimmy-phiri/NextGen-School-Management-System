import { KpiSparkline } from '@/Components/Dashboard/KpiSparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import {
    admissionCandidates,
    attentionAlerts,
    attendanceGaugeData,
    masterControlModules,
    monthlyFinancials,
    sparklineAttendance,
    sparklineFees,
    studentGrowthTrend,
} from '@/data/dashboardMock';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Award,
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    GraduationCap,
    Layers,
    MoreHorizontal,
    Plus,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type AttendanceSnapshot = {
    date?: string;
    present?: number;
};

type KpiCardData = {
    label: string;
    value: string;
    tone: 'pink' | 'yellow' | 'blue' | 'green';
    note: string;
    delta: string;
    icon: string;
};

type StudentRow = {
    id: string;
    name: string;
    email: string;
    group: string;
    status: string;
    photo?: string;
};

type ActivityItem = {
    name: string;
    text: string;
    time: string;
    photo?: string;
    type?: string;
};

type CalendarEvent = {
    id: number;
    month: string;
    day: string;
    tone: string;
    title: string;
    meta: string;
};

type ApplicationSlice = {
    name: string;
    value: number;
    color: string;
};

type PerformancePoint = {
    name: string;
    students: number;
    teachers: number;
};

type RoleAction = {
    label: string;
    href: string;
    icon?: string;
    variant?: 'primary' | 'outline';
    pink?: boolean;
};

type RoleConfig = {
    eyebrow: string;
    title: string;
    subtitle: string;
    actions: RoleAction[];
    rail_actions: RoleAction[];
};

type DashboardAnalytics = {
    scope?: string;
    school_id?: number;
    school_name?: string;
    academic_year?: string;
    current_term?: string;
    currency?: string;
    primary_role?: string;
    roles?: string[];
    role_config?: RoleConfig;
    kpis?: KpiCardData[];
    recently_added_students?: StudentRow[];
    recent_activity?: ActivityItem[];
    upcoming_events?: CalendarEvent[];
    application_breakdown?: ApplicationSlice[];
    performance_scores?: PerformancePoint[];
    metrics?: {
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

const tickStyle = { fill: '#94a3b8', fontSize: 10 };

const rawPerformanceData: PerformancePoint[] = [
    { name: 'Jan', students: 65, teachers: 49 },
    { name: 'Feb', students: 52, teachers: 48 },
    { name: 'Mar', students: 72, teachers: 55 },
    { name: 'Apr', students: 61, teachers: 58 },
    { name: 'May', students: 89, teachers: 67 },
    { name: 'Jun', students: 72, teachers: 58 },
    { name: 'Jul', students: 81, teachers: 64 },
    { name: 'Aug', students: 62, teachers: 53 },
    { name: 'Sep', students: 75, teachers: 64 },
    { name: 'Oct', students: 94, teachers: 78 },
    { name: 'Nov', students: 82, teachers: 69 },
    { name: 'Dec', students: 90, teachers: 73 },
];

const fallbackStudents: StudentRow[] = [
    {
        id: 'STU-001',
        name: 'Olivia Rhye',
        email: 'olivia@untitledui.com',
        group: 'Grade 10A',
        status: 'Active',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
    },
    {
        id: 'STU-002',
        name: 'Phoenix Baker',
        email: 'phoenix@untitledui.com',
        group: 'Grade 11B',
        status: 'Active',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
    },
    {
        id: 'STU-003',
        name: 'Lana Steiner',
        email: 'lana@untitledui.com',
        group: 'Grade 9C',
        status: 'Pending',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    },
    {
        id: 'STU-004',
        name: 'Demi Wilkinson',
        email: 'demi@untitledui.com',
        group: 'Grade 12A',
        status: 'Active',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces',
    },
    {
        id: 'STU-005',
        name: 'Candice Wu',
        email: 'candice@untitledui.com',
        group: 'Grade 10B',
        status: 'Active',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
    },
];

const fallbackActivities: ActivityItem[] = [
    {
        name: 'Olivia Rhye',
        text: 'New student enrolled',
        time: '12 min ago',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
        type: 'enrollment',
    },
    {
        name: 'Michael Thompson',
        text: 'Attendance submitted',
        time: '35 min ago',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
        type: 'attendance',
    },
    {
        name: 'Lana Steiner',
        text: 'Term fees received',
        time: '1 hour ago',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
        type: 'payment',
    },
    {
        name: 'Demi Wilkinson',
        text: 'Application approved',
        time: '2 hours ago',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces',
        type: 'admission',
    },
];

const fallbackApplications: ApplicationSlice[] = [
    { name: 'Pending', value: 1, color: '#facc15' },
    { name: 'Approved', value: 2, color: '#60a5fa' },
    { name: 'Review', value: 1, color: '#f472b6' },
];

const fallbackEvents: CalendarEvent[] = [
    {
        id: 1,
        month: 'NOV',
        day: '15',
        tone: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        title: 'Mid-Term Examinations',
        meta: '09:00 AM · Academics',
    },
    {
        id: 2,
        month: 'NOV',
        day: '18',
        tone: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
        title: 'PTA General Assembly',
        meta: '02:00 PM · Community',
    },
    {
        id: 3,
        month: 'NOV',
        day: '22',
        tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        title: 'Inter-House Athletics',
        meta: '08:30 AM · Sports',
    },
];

function renderKpiIcon(iconName?: string) {
    switch (iconName) {
        case 'GraduationCap':
            return <GraduationCap size={18} />;
        case 'Users':
            return <Users size={18} />;
        case 'BookOpen':
            return <BookOpen size={18} />;
        case 'Wallet':
            return <Wallet size={18} />;
        case 'ClipboardCheck':
            return <CheckCircle2 size={18} />;
        case 'FileText':
            return <FileText size={18} />;
        case 'Award':
            return <Award size={18} />;
        case 'TrendingUp':
            return <TrendingUp size={18} />;
        case 'AlertCircle':
            return <AlertCircle size={18} />;
        case 'CalendarDays':
            return <CalendarDays size={18} />;
        default:
            return <GraduationCap size={18} />;
    }
}

function renderActionIcon(iconName?: string, className?: string) {
    switch (iconName) {
        case 'Plus':
            return <Plus size={14} className={className} />;
        case 'FileText':
            return <FileText size={14} className={className} />;
        case 'ClipboardCheck':
            return <CheckCircle2 size={14} className={className} />;
        case 'CalendarDays':
            return <CalendarDays size={14} className={className} />;
        case 'Wallet':
            return <Wallet size={14} className={className} />;
        default:
            return <Plus size={14} className={className} />;
    }
}

function StudentAvatar({
    photo,
    name,
    size = 'sm',
}: {
    photo?: string;
    name: string;
    size?: 'sm' | 'md';
}) {
    const [err, setErr] = useState(false);
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const sizeClasses = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs';

    if (photo && !err) {
        return (
            <img
                src={photo}
                alt={name}
                onError={() => setErr(true)}
                className={cn('rounded-full object-cover shrink-0 border border-slate-200/80', sizeClasses)}
            />
        );
    }
    return (
        <span
            className={cn(
                'rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0 border border-slate-200/80',
                sizeClasses,
            )}
        >
            {initials}
        </span>
    );
}

export default function Dashboard() {
    const { auth, analytics } = usePage<PageProps<{ analytics: DashboardAnalytics }>>().props;
    const user = auth.user;

    const [chartMode, setChartMode] = useState<'Academic' | 'Attendance'>('Academic');
    const [chartRange, setChartRange] = useState<'This year' | 'Last 6 months'>('This year');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const [financialTab, setFinancialTab] = useState<'earn' | 'due' | 'expense'>('earn');
    const [selectedYear, setSelectedYear] = useState('2026');

    // Role-based Config from Backend
    const roleConfig = analytics?.role_config ?? {
        eyebrow: 'YOUR SCHOOL AT A GLANCE',
        title: 'Admin dashboard',
        subtitle: `Welcome back, ${user?.name?.split(' ')[0] ?? 'User'}. Here’s what’s happening at school today.`,
        actions: [
            { label: 'View reports', href: '/reports', icon: 'FileText', variant: 'outline' },
            { label: 'Add student', href: '/students/create', icon: 'Plus', variant: 'primary' },
        ],
        rail_actions: [
            { label: 'Add student', href: '/students/create', pink: true },
            { label: 'Add teacher', href: '/users/create', pink: false },
        ],
    };

    // 4 Dynamic KPI Cards scoped to School & Role
    const kpiCards: KpiCardData[] = analytics?.kpis?.length
        ? analytics.kpis
        : [
              {
                  label: 'Total students',
                  value: (analytics?.metrics?.students ?? 12).toString(),
                  tone: 'pink',
                  note: 'Enrolled students',
                  delta: '8.2%',
                  icon: 'GraduationCap',
              },
              {
                  label: 'Total teachers',
                  value: (analytics?.metrics?.staff ?? 8).toString(),
                  tone: 'yellow',
                  note: 'Teaching staff',
                  delta: '12%',
                  icon: 'Users',
              },
              {
                  label: 'Active classes',
                  value: '8',
                  tone: 'blue',
                  note: 'Across all grades',
                  delta: '8.2%',
                  icon: 'BookOpen',
              },
              {
                  label: 'Fees collected',
                  value: '$4,050',
                  tone: 'green',
                  note: 'Term 1',
                  delta: '8.2%',
                  icon: 'Wallet',
              },
          ];

    // Real Recently Added Students scoped to School
    const studentsList: StudentRow[] = analytics?.recently_added_students?.length
        ? analytics.recently_added_students
        : fallbackStudents;

    // Real Recent Activity from Payments & Enrollments
    const activityList: ActivityItem[] = analytics?.recent_activity?.length
        ? analytics.recent_activity
        : fallbackActivities;

    // Real Upcoming School Calendar Events
    const eventsList: CalendarEvent[] = analytics?.upcoming_events?.length
        ? analytics.upcoming_events
        : fallbackEvents;

    // Real Application Breakdown
    const applicationsList: ApplicationSlice[] = analytics?.application_breakdown?.length
        ? analytics.application_breakdown
        : fallbackApplications;

    const totalApplications = applicationsList.reduce((acc, curr) => acc + (curr.value || 0), 0);

    // Real Academic Performance Trend
    const baseScores: PerformancePoint[] = analytics?.performance_scores?.length
        ? analytics.performance_scores
        : rawPerformanceData;

    const currentBarData = (chartRange === 'Last 6 months' ? baseScores.slice(6) : baseScores).map(
        (item) =>
            chartMode === 'Attendance'
                ? {
                      ...item,
                      students: Math.min(100, item.students + 8),
                      teachers: Math.round(item.teachers / 8),
                  }
                : item,
    );

    const toggleSelectAll = () => {
        if (selectedStudents.length === studentsList.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(studentsList.map((s) => s.id));
        }
    };

    const toggleSelectStudent = (id: string) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    const presentTodayRate =
        analytics?.metrics?.attendance_today &&
        (analytics.metrics.attendance_today.total ?? 0) > 0
            ? Math.round(
                  ((analytics.metrics.attendance_today.total ?? 0) -
                      (analytics.metrics.attendance_today.absent ?? 0)) /
                      (analytics.metrics.attendance_today.total ?? 1) *
                      100,
              )
            : 94.6;

    const existingKpiCards = [
        {
            title: 'Total Students',
            value: (analytics?.metrics?.students ?? 1650).toLocaleString(),
            delta: '+3.0%',
            subtext: 'From Last Month',
            up: true,
            icon: GraduationCap,
            color: 'hsl(217 91% 60%)',
            spark: sparklineAttendance,
            sparkColor: '#3b82f6',
        },
        {
            title: 'Total Teachers',
            value: (analytics?.metrics?.staff ?? 68).toString(),
            delta: '+1.1%',
            subtext: 'From Last Month',
            up: true,
            icon: Users,
            color: 'hsl(199 89% 48%)',
            spark: sparklineAttendance,
            sparkColor: '#0ea5e9',
        },
        {
            title: "Today's Attendance",
            value: `${presentTodayRate}%`,
            delta: '+0.8%',
            subtext: 'From Last Month',
            up: true,
            icon: BookOpen,
            color: 'hsl(142 69% 45%)',
            spark: sparklineAttendance,
            sparkColor: '#22c55e',
        },
        {
            title: 'Monthly Revenue',
            value: 'MWK 5.2M',
            delta: '+6.4%',
            subtext: 'From Last Month',
            up: true,
            icon: Wallet,
            color: 'hsl(38 92% 50%)',
            spark: sparklineFees,
            sparkColor: '#f59e0b',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={roleConfig.title} />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* 1. Header: Page Title + Eyebrow + Dynamic Actions                   */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            {roleConfig.eyebrow}
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            {roleConfig.title} <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {roleConfig.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {roleConfig.actions?.map((act, idx) => (
                            <Link
                                key={idx}
                                href={act.href}
                                className={
                                    act.variant === 'primary'
                                        ? 'inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer'
                                        : 'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 transition-all cursor-pointer dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted'
                                }
                            >
                                {renderActionIcon(act.icon, act.variant === 'outline' ? 'text-slate-500' : '')}
                                <span>{act.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* 2. 4 Pastel Role-Tailored KPI Cards                                */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div className="stats-grid">
                    {kpiCards.map((kpi, idx) => (
                        <div key={idx} className={cn('stat-card', `tone-${kpi.tone}`)}>
                            <div className="stat-label">
                                <span>{kpi.label}</span>
                                {renderKpiIcon(kpi.icon)}
                            </div>
                            <strong>{kpi.value}</strong>
                            <div className="stat-note">
                                <span className="stat-note-label">{kpi.note}</span>
                                <span className="stat-note-badge">
                                    <ArrowUpRight size={13} /> {kpi.delta}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* 3. 2-Column Layout (Main + Rail)                                   */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div className="dashboard-grid">
                    {/* ── Main Column ─────────────────────────────────────────────── */}
                    <div className="dashboard-main">
                        {/* Academic Performance Panel */}
                        <div className="school-panel">
                            <div className="panel-heading">
                                <h2>Academic performance</h2>
                                <select
                                    className="quiet-select"
                                    aria-label="Chart period"
                                    value={chartRange}
                                    onChange={(e) => setChartRange(e.target.value as any)}
                                >
                                    <option>This year</option>
                                    <option>Last 6 months</option>
                                </select>
                            </div>

                            <div className="chart-subhead">
                                <div className="segmented">
                                    <button
                                        type="button"
                                        className={chartMode === 'Academic' ? 'selected' : ''}
                                        onClick={() => setChartMode('Academic')}
                                    >
                                        Academic
                                    </button>
                                    <button
                                        type="button"
                                        className={chartMode === 'Attendance' ? 'selected' : ''}
                                        onClick={() => setChartMode('Attendance')}
                                    >
                                        Attendance
                                    </button>
                                </div>

                                <div className="chart-legend">
                                    <span>
                                        <i className="legend-blue" />
                                        {chartMode === 'Academic' ? 'Students' : 'Present'}
                                    </span>
                                    <span>
                                        <i className="legend-orange" />
                                        {chartMode === 'Academic' ? 'Class average' : 'Late'}
                                    </span>
                                </div>
                            </div>

                            <div className="main-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={currentBarData} barGap={5}>
                                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 5" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={tickStyle}
                                            dy={8}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={tickStyle}
                                            width={28}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                            contentStyle={{
                                                background: '#ffffff',
                                                borderColor: '#e2e8f0',
                                                borderRadius: 8,
                                                fontSize: 11,
                                            }}
                                        />
                                        <Bar
                                            dataKey="students"
                                            name={chartMode === 'Academic' ? 'Students' : 'Present'}
                                            fill="#60a5fa"
                                            radius={[3, 3, 0, 0]}
                                            maxBarSize={12}
                                        />
                                        <Bar
                                            dataKey="teachers"
                                            name={chartMode === 'Academic' ? 'Class average' : 'Late'}
                                            fill="#fb923c"
                                            radius={[3, 3, 0, 0]}
                                            maxBarSize={12}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-footer">
                                <span className="positive-text">
                                    <ArrowUpRight size={14} /> 8.2% increase
                                </span>
                                <span>compared to the previous academic year</span>
                            </div>
                        </div>

                        {/* Recently Added Students Panel */}
                        <div className="school-panel">
                            <div className="panel-heading">
                                <h2>Recently added students</h2>
                                <Link
                                    href="/students"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    View all students <ArrowUpRight size={13} />
                                </Link>
                            </div>

                            <div className="table-scroll">
                                <table className="school-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 32 }}>
                                                <input
                                                    type="checkbox"
                                                    aria-label="Select all students"
                                                    checked={selectedStudents.length === studentsList.length && studentsList.length > 0}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            <th>Student name</th>
                                            <th>Student ID</th>
                                            <th>Class</th>
                                            <th>Status</th>
                                            <th style={{ width: 32 }} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsList.map((r) => (
                                            <tr key={r.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`Select ${r.name}`}
                                                        checked={selectedStudents.includes(r.id)}
                                                        onChange={() => toggleSelectStudent(r.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="person-cell">
                                                        <UserAvatar src={r.photo} name={r.name} size="sm" />
                                                        <div>
                                                            <strong>{r.name}</strong>
                                                            <span>{r.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{r.id}</td>
                                                <td>
                                                    <span className="class-tag">{r.group}</span>
                                                </td>
                                                <td>
                                                    <span className={cn('status-pill', r.status.toLowerCase() === 'active' ? 'positive' : 'pending')}>
                                                        <span className="status-pill-dot" />
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        href="/students"
                                                        className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                                        title={`View ${r.name}`}
                                                    >
                                                        <ArrowUpRight size={13} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── Rail Column ─────────────────────────────────────────────── */}
                    <aside className="dashboard-rail">
                        {/* Dynamic Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {roleConfig.rail_actions?.map((act, idx) => (
                                <Link
                                    key={idx}
                                    href={act.href}
                                    className={
                                        act.pink
                                            ? 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-pink-100/90 text-pink-700 hover:bg-pink-200/90 dark:bg-pink-950/60 dark:text-pink-300 px-3 py-2 text-xs font-semibold transition-all shadow-2xs'
                                            : 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-border dark:bg-card dark:text-slate-200 px-3 py-2 text-xs font-semibold transition-all shadow-2xs'
                                    }
                                >
                                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                                    <span>{act.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Recent Activity Panel */}
                        <div className="school-panel">
                            <div className="panel-heading">
                                <h2>Recent activity</h2>
                                <Bell size={15} className="text-slate-400" />
                            </div>

                            <div className="activity-list">
                                {activityList.map((a, idx) => (
                                    <div className="activity" key={idx}>
                                        <UserAvatar name={a.name} src={a.photo} size="sm" />
                                        <div>
                                            <strong>{a.name}</strong>
                                            <p>{a.text}</p>
                                            <span>{a.time}</span>
                                        </div>
                                        {a.type === 'payment' ? (
                                            <Wallet size={14} className="text-amber-500 mt-1 shrink-0" />
                                        ) : (
                                            <CheckCircle2 size={14} className="text-emerald-600 mt-1 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Link href="/admissions" className="rail-link">
                                View all activity <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* Application Breakdown Panel */}
                        <div className="school-panel">
                            <div className="panel-heading">
                                <h2>Application breakdown</h2>
                                <MoreHorizontal size={17} className="text-slate-400" />
                            </div>
                            <span className="panel-caption">Current academic year</span>

                            <div className="donut-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={applicationsList}
                                            innerRadius="70%"
                                            outerRadius="93%"
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={6}
                                        >
                                            {applicationsList.map((r) => (
                                                <Cell key={r.name} fill={r.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="donut-label">
                                    <strong>{totalApplications}</strong>
                                    <span>Total applications</span>
                                </div>
                            </div>

                            <div className="donut-legend">
                                {applicationsList.map((a) => (
                                    <div key={a.name}>
                                        <i style={{ backgroundColor: a.color }} />
                                        <span>{a.name}</span>
                                        <strong>{a.value}</strong>
                                        <small>{totalApplications > 0 ? Math.round((a.value / totalApplications) * 100) : 0}%</small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events Panel */}
                        <div className="school-panel">
                            <div className="panel-heading">
                                <h2>Upcoming events</h2>
                                <Clock size={15} className="text-slate-400" />
                            </div>

                            <div className="upcoming-events">
                                {eventsList.map((e) => (
                                    <Link key={e.id} href="/calendar">
                                        <div className={cn('date-block', e.tone)}>
                                            <span>{e.month}</span>
                                            <strong>{e.day}</strong>
                                        </div>
                                        <div>
                                            <strong>{e.title}</strong>
                                            <span>{e.meta}</span>
                                        </div>
                                        <ArrowUpRight size={13} className="text-slate-400 shrink-0 ml-auto" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Insight Banner */}
                        <div className="insight-banner">
                            <Sparkles size={20} />
                            <h3>A little progress, every day.</h3>
                            <p>Celebrate your school’s brightest achievements.</p>
                            <Link href="/reports">
                                Explore reports <ArrowUpRight size={13} />
                            </Link>
                        </div>
                    </aside>
                </div>

                <div className="sample-footnote">
                    {analytics?.school_name ?? 'NextGen School'} <span>·</span> Academic Year {analytics?.academic_year ?? '2026 - 2027'} <span>·</span> {analytics?.current_term ?? 'Term 1'}
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* 4. PRESERVED EXISTING DASHBOARD MODULES (HARMONIOUS DRAWER)        */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <details className="group mt-14 rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all dark:border-border dark:bg-card">
                    <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-slate-800 list-none dark:text-slate-200">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                <Layers size={14} />
                            </span>
                            <span className="text-xs font-bold">Institutional Operations & Multi-Year Analytics</span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-muted dark:text-slate-300">
                                Expandable Control Hub
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                            <span className="group-open:hidden">Show details</span>
                            <span className="hidden group-open:inline">Hide details</span>
                            <span className="transition-transform group-open:rotate-180">▾</span>
                        </div>
                    </summary>

                    <div className="mt-6 border-t border-slate-100 pt-6 space-y-8 dark:border-border">
                        {/* Preserved KPI Stat Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {existingKpiCards.map((card, index) => {
                                const Icon = card.icon;
                                return (
                                    <div
                                        key={card.title}
                                        className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-border dark:bg-card"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {card.title}
                                                </p>
                                                <p className="mt-1 text-2xl font-black tracking-tight text-foreground">
                                                    {card.value}
                                                </p>
                                            </div>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 text-foreground">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                <ArrowUpRight className="h-3 w-3" />
                                                <span>{card.delta}</span>
                                                <span className="font-normal text-muted-foreground text-[10px]">
                                                    {card.subtext}
                                                </span>
                                            </div>
                                            <KpiSparkline data={card.spark} color={card.sparkColor} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Preserved Charts: Student Growth & Financial Overview */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div>
                                            <CardTitle className="text-xs font-bold">Student Growth Trend</CardTitle>
                                            <div className="mt-1 flex items-center gap-4 text-[10px]">
                                                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Total (1,650)
                                                </span>
                                                <span className="flex items-center gap-1.5 font-medium text-blue-600">
                                                    <span className="h-2 w-2 rounded-full bg-blue-500" /> New (180)
                                                </span>
                                                <span className="flex items-center gap-1.5 font-medium text-rose-500">
                                                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Dropped (15)
                                                </span>
                                            </div>
                                        </div>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold text-foreground focus:outline-none"
                                        >
                                            <option value="2026">2026</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </CardHeader>
                                    <CardContent className="h-64 pt-3">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={studentGrowthTrend}>
                                                <defs>
                                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                                                <XAxis dataKey="month" tick={tickStyle} stroke="none" />
                                                <YAxis tick={tickStyle} stroke="none" width={35} />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: 8,
                                                        border: '1px solid hsl(var(--border))',
                                                        background: 'hsl(var(--card))',
                                                        fontSize: 11,
                                                    }}
                                                />
                                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total" />
                                                <Area type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorNew)" name="New" />
                                                <Area type="monotone" dataKey="dropped" stroke="#f43f5e" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Dropped" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Financial Overview</p>
                                            <p className="text-xl font-black text-foreground">MWK 5,065,000.00</p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 text-[11px] font-bold">
                                            <button
                                                type="button"
                                                onClick={() => setFinancialTab('earn')}
                                                className={`rounded-md px-2.5 py-1 transition-colors ${
                                                    financialTab === 'earn'
                                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Total Earn
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFinancialTab('due')}
                                                className={`rounded-md px-2.5 py-1 transition-colors ${
                                                    financialTab === 'due'
                                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Total Due
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFinancialTab('expense')}
                                                className={`rounded-md px-2.5 py-1 transition-colors ${
                                                    financialTab === 'expense'
                                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Expense
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="h-64 pt-3">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyFinancials}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                                                <XAxis dataKey="month" tick={tickStyle} stroke="none" />
                                                <YAxis tick={tickStyle} stroke="none" width={40} tickFormatter={(val) => `${val / 1000}M`} />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: 8,
                                                        border: '1px solid hsl(var(--border))',
                                                        background: 'hsl(var(--card))',
                                                        fontSize: 11,
                                                    }}
                                                    formatter={(value: any) => [`MWK ${(Number(value) * 1000).toLocaleString()}`, 'Amount']}
                                                />
                                                <Bar dataKey={financialTab} radius={[4, 4, 0, 0]} fill="#f97316">
                                                    {monthlyFinancials.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${entry.month}`}
                                                            fill={index === monthlyFinancials.length - 1 ? '#ea580c' : '#fdba74'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Attention Alerts */}
                            <div className="space-y-6">
                                <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-orange-500" />
                                            <CardTitle className="text-xs font-bold">Attention Alerts</CardTitle>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                                            6 Urgent
                                        </span>
                                    </CardHeader>
                                    <CardContent className="space-y-2.5">
                                        {attentionAlerts.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className="flex items-center justify-between rounded-lg border border-border/70 bg-card p-2.5 transition-colors hover:bg-muted/40"
                                            >
                                                <div className="min-w-0 flex-1 pr-2">
                                                    <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                                                    <p className="truncate text-[10px] text-muted-foreground">{alert.description}</p>
                                                </div>
                                                <Link
                                                    href={alert.href}
                                                    className="rounded border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    {alert.action}
                                                </Link>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Preserved Master Control Panel */}
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Master Control Panel</h3>
                            <p className="text-[11px] text-muted-foreground">High-velocity operational modules across institutional domains.</p>

                            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                                {masterControlModules.map((module) => (
                                    <div
                                        key={module.title}
                                        className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all hover:shadow-sm dark:border-border dark:bg-card"
                                    >
                                        <div>
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold"
                                                style={{ backgroundColor: `${module.color}15`, color: module.color }}
                                            >
                                                <Layers className="h-4 w-4" />
                                            </div>
                                            <h4 className="mt-2 text-xs font-bold text-foreground">{module.title}</h4>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {module.links.map((link) => (
                                                <Link
                                                    key={link.label}
                                                    href={link.href}
                                                    className="rounded border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preserved Bottom Row: Admission Candidates, Activities & Attendance Overview */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-xs font-bold">Admission Requests</CardTitle>
                                        <p className="text-[10px] text-muted-foreground">12 New applicants</p>
                                    </div>
                                    <Link href="/admissions" className="text-[11px] font-semibold text-primary hover:underline">
                                        View All &rarr;
                                    </Link>
                                </CardHeader>
                                <CardContent className="divide-y divide-border/60">
                                    {admissionCandidates.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                                                    {c.id}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">{c.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{c.class} &middot; {c.time}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/admissions"
                                                className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold hover:bg-muted"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs font-bold">System Log Activities</CardTitle>
                                    <Link href="/audit-log" className="text-[11px] font-semibold text-primary hover:underline">
                                        Activity Log &rarr;
                                    </Link>
                                </CardHeader>
                                <CardContent className="space-y-2.5">
                                    <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/20 p-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                                            <Wallet className="h-3.5 w-3.5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-foreground">Payment Received - Thandiwe Banda</p>
                                            <p className="text-[10px] text-muted-foreground">MWK 85,000 &middot; Airtel Money &middot; 7m ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/20 p-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                                            <GraduationCap className="h-3.5 w-3.5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-foreground">New Student Added - Chisomo Jere</p>
                                            <p className="text-[10px] text-muted-foreground">Form 2 Stream B &middot; 12m ago</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl border-slate-200/90 dark:border-border shadow-xs">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-xs font-bold">Attendance Overview</CardTitle>
                                    <p className="text-[10px] text-muted-foreground">Daily attendance roll breakdown</p>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <div className="relative h-40 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={attendanceGaugeData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={45}
                                                    outerRadius={65}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    {attendanceGaugeData.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-black text-foreground">94.6%</span>
                                            <span className="text-[9px] uppercase font-bold text-muted-foreground">Today's Rate</span>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex w-full justify-around border-t border-border/60 pt-2.5 text-center text-[10px]">
                                        <div>
                                            <p className="font-bold text-orange-600">1,540 (94.6%)</p>
                                            <p className="text-[9px] text-muted-foreground">Present</p>
                                        </div>
                                        <div className="h-7 w-px bg-border/60" />
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-300">70 (4.2%)</p>
                                            <p className="text-[9px] text-muted-foreground">Absent</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </details>
            </div>
        </AuthenticatedLayout>
    );
}
