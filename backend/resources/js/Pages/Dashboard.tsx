import { DashboardChartsGrid } from '@/Components/Dashboard/DashboardChartsGrid';
import { KpiSparkline } from '@/Components/Dashboard/KpiSparkline';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import {
    notificationsFeed,
    recentAdmissions,
    recentPayments,
    sparklineAttendance,
    sparklineFees,
} from '@/data/dashboardMock';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    Bell,
    BookOpen,
    ClipboardList,
    GraduationCap,
    Megaphone,
    Plus,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';

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

    const presentToday =
        analytics?.metrics?.attendance_today &&
        (analytics.metrics.attendance_today.total ?? 0) > 0
            ? Math.round(
                  ((analytics.metrics.attendance_today.total ?? 0) -
                      (analytics.metrics.attendance_today.absent ?? 0)) /
                      (analytics.metrics.attendance_today.total ?? 1) *
                      100,
              )
            : 94;

    const metricCards = [
        {
            label: 'Total students',
            value: analytics?.metrics?.students ?? 0,
            delta: '+4.2%',
            up: true,
            hint: 'Live enrollment from tenant service.',
            icon: GraduationCap,
            spark: sparklineAttendance,
            sparkColor: 'hsl(217 91% 60%)',
        },
        {
            label: 'Total teachers',
            value: analytics?.metrics?.staff ?? 0,
            delta: '+1.1%',
            up: true,
            hint: 'Licensed teaching & admin seats.',
            icon: Users,
            spark: sparklineAttendance,
            sparkColor: 'hsl(199 89% 48%)',
        },
        {
            label: 'Active classes',
            value: 28,
            delta: '0%',
            up: true,
            hint: 'Placeholder until timetable service ships.',
            icon: BookOpen,
            spark: sparklineFees,
            sparkColor: 'hsl(38 92% 50%)',
        },
        {
            label: 'Fee collections (MTD)',
            value: 'MWK 4.2M',
            delta: '+6.4%',
            up: true,
            hint: 'Mock narrative · wire finance API.',
            icon: Wallet,
            spark: sparklineFees,
            sparkColor: 'hsl(142 69% 45%)',
        },
        {
            label: 'Outstanding balances',
            value: analytics?.metrics?.open_invoices ?? 0,
            delta: '-2.0%',
            up: false,
            hint: 'Open receivable lines across families.',
            icon: TrendingUp,
            spark: sparklineFees,
            sparkColor: 'hsl(0 84% 60%)',
        },
        {
            label: 'Attendance rate (today)',
            value: `${presentToday}%`,
            delta: '+0.8%',
            up: true,
            hint: 'Blended live + cached session capture.',
            icon: ClipboardList,
            spark: sparklineAttendance,
            sparkColor: 'hsl(217 91% 60%)',
        },
    ];

    const quickActions = [
        {
            label: 'Add student',
            href: route('erp.page', { pageKey: 'students-registration' }),
            icon: Plus,
        },
        {
            label: 'Record payment',
            href: route('erp.page', { pageKey: 'finance-payments' }),
            icon: Wallet,
        },
        {
            label: 'Mark attendance',
            href: route('attendance.index'),
            icon: ClipboardList,
        },
        {
            label: 'Create announcement',
            href: route('erp.page', { pageKey: 'communication-announcements' }),
            icon: Megaphone,
        },
        {
            label: 'Generate report',
            href: route('erp.page', { pageKey: 'reports-academic' }),
            icon: TrendingUp,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Overview dashboard" />

            <div className="space-y-10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Overview dashboard
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                            Command center
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Scoped to{' '}
                            <span className="font-semibold text-foreground">
                                {analytics?.scope === 'platform'
                                    ? 'multi-school platform view'
                                    : 'your active school context'}
                            </span>
                            . KPIs blend live analytics with premium UI placeholders for investor-ready demos.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
                            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                            Live + mock blend
                        </span>
                        <Link
                            href={route('dashboard.analytics')}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        >
                            Open analytics
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {metricCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3 p-6">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                            {card.value}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                                            {card.up ? (
                                                <ArrowUpRight className="h-4 w-4 text-emerald-500" aria-hidden />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-rose-500" aria-hidden />
                                            )}
                                            <span
                                                className={
                                                    card.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                }
                                            >
                                                {card.delta}
                                            </span>
                                            <span className="font-normal text-muted-foreground">vs last period</span>
                                        </div>
                                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                            {card.hint}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </div>
                                        <KpiSparkline data={card.spark} color={card.sparkColor} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Quick actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {quickActions.map((a) => {
                                const Ic = a.icon;
                                return (
                                    <Link
                                        key={a.label}
                                        href={a.href}
                                        className="flex items-center gap-3 rounded-xl border border-transparent bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-muted"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Ic className="h-4 w-4" />
                                        </span>
                                        {a.label}
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Notifications</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {notificationsFeed.map((n) => (
                                <div
                                    key={n.title}
                                    className="rounded-xl border border-border/80 bg-muted/20 p-3"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                                        <Badge
                                            variant={
                                                n.tone === 'warning'
                                                    ? 'warning'
                                                    : n.tone === 'success'
                                                      ? 'success'
                                                      : 'secondary'
                                            }
                                        >
                                            {n.tone}
                                        </Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">{n.detail}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Upcoming exams</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 px-3 py-2">
                                <span className="font-medium">Form 4 · Mathematics</span>
                                <span className="text-xs text-muted-foreground">Jun 18</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 px-3 py-2">
                                <span className="font-medium">Grade 9 · English</span>
                                <span className="text-xs text-muted-foreground">Jun 20</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 px-3 py-2">
                                <span className="font-medium">Grade 7 · Science</span>
                                <span className="text-xs text-muted-foreground">Jun 22</span>
                            </div>
                            <Link
                                href={route('erp.page', { pageKey: 'academics-exams' })}
                                className="block text-center text-xs font-semibold text-primary hover:underline"
                            >
                                View exam calendar
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Recent payments</CardTitle>
                            <Link
                                href={route('erp.page', { pageKey: 'finance-payments' })}
                                className="text-xs font-semibold text-primary hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full min-w-[520px] text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Student</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Method</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentPayments.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-muted-foreground">
                                                {row.id}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-foreground">{row.student}</td>
                                            <td className="px-6 py-3">{row.amount}</td>
                                            <td className="px-6 py-3 text-muted-foreground">{row.method}</td>
                                            <td className="px-6 py-3">
                                                <Badge variant={row.status === 'Posted' ? 'success' : 'warning'}>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Recent admissions</CardTitle>
                            <Link
                                href={route('erp.page', { pageKey: 'students-admissions' })}
                                className="text-xs font-semibold text-primary hover:underline"
                            >
                                Pipeline
                            </Link>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full min-w-[480px] text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Applicant</th>
                                        <th className="px-6 py-3">Class</th>
                                        <th className="px-6 py-3">Stage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentAdmissions.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-muted-foreground">
                                                {row.id}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-foreground">{row.name}</td>
                                            <td className="px-6 py-3 text-muted-foreground">{row.class}</td>
                                            <td className="px-6 py-3">
                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                    {row.stage}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">Analytics widgets</h2>
                        <Link
                            href={route('dashboard.analytics')}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            Full analytics workspace
                        </Link>
                    </div>
                    <DashboardChartsGrid />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
