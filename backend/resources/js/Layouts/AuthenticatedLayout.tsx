import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import UserAvatar from '@/Components/UserAvatar';
import {
    type NavContext,
    resolveNavigation,
    type ResolvedNavBranch,
    type ResolvedNavLeaf,
    type ResolvedNavTop,
} from '@/config/appNavigation';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import type { AuthUser, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Bell,
    ChevronDown,
    ChevronRight,
    Globe,
    Menu,
    Moon,
    PanelLeft,
    School,
    Search,
    Settings,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import {
    Fragment,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

const SIDEBAR_STORAGE_KEY = 'ng-admin-sidebar-expanded';

const demoNotifications = [
    { id: 1, title: 'New payment posted', detail: 'MWK 85,000 · Thandiwe Banda', unread: true },
    { id: 2, title: 'Attendance below threshold', detail: 'Grade 9B · 87%', unread: true },
    { id: 3, title: 'Exam timetable published', detail: 'Term 2 midterms', unread: false },
];

export default function AuthenticatedLayout({
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<{ header?: ReactNode; breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth, capabilities } = usePage<PageProps>().props;
    const page = usePage<PageProps>();
    const pageUrl = page.url;
    const currentRoute = route().current();

    const user = auth.user as AuthUser | null;
    const schoolName = user?.school?.name ?? 'Sunrise Academy';

    const defaultBreadcrumbs = useMemo<BreadcrumbItem[]>(() => {
        const path = pageUrl.split('?')[0].replace(/^\/|\/$/g, '');
        if (!path || path === 'dashboard') {
            return [{ label: 'Workspace', href: '/dashboard' }, { label: 'Dashboard' }];
        }

        const segments = path.split('/');
        const first = segments[0];

        const sectionMap: Record<string, { section: string; sectionHref: string; label: string }> = {
            students: { section: 'School Management', sectionHref: '/students', label: 'Students' },
            users: { section: 'School Management', sectionHref: '/users', label: 'Teachers & Staff' },
            guardians: { section: 'School Management', sectionHref: '/guardians', label: 'Parents' },
            admissions: { section: 'School Management', sectionHref: '/admissions', label: 'Applications' },
            attendance: { section: 'School Management', sectionHref: '/attendance', label: 'Attendance' },
            classes: { section: 'Academics', sectionHref: '/classes', label: 'Classes & Subjects' },
            subjects: { section: 'Academics', sectionHref: '/subjects', label: 'Subjects' },
            finance: { section: 'Finance', sectionHref: '/finance', label: 'Fee Management' },
            fees: { section: 'Finance', sectionHref: '/fees', label: 'Fee Management' },
            invoices: { section: 'Finance', sectionHref: '/invoices', label: 'Invoices' },
            payments: { section: 'Finance', sectionHref: '/payments', label: 'Payments' },
            roles: { section: 'Settings', sectionHref: '/roles', label: 'Roles & Permissions' },
            permissions: { section: 'Settings', sectionHref: '/permissions', label: 'Permissions' },
            'school-setup': { section: 'Settings', sectionHref: '/school-setup', label: 'School Setup' },
            reports: { section: 'Reporting', sectionHref: '/reports', label: 'Reports' },
            calendar: { section: 'School Life', sectionHref: '/calendar', label: 'Calendar' },
            profile: { section: 'Account', sectionHref: '/profile', label: 'Profile' },
        };

        const match = sectionMap[first];
        if (match) {
            const crumbs: BreadcrumbItem[] = [{ label: match.section, href: match.sectionHref }];
            if (segments.length === 1) {
                crumbs.push({ label: match.label });
            } else {
                crumbs.push({ label: match.label, href: match.sectionHref });
                const sub = segments.slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                crumbs.push({ label: sub });
            }
            return crumbs;
        }

        return segments.map((seg, i) => ({
            label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
            href: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
        }));
    }, [pageUrl]);

    const activeBreadcrumbs = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

    const hasSchool = Boolean(user?.school_id);
    const rawRoles = user?.roles ?? [];
    const roles = useMemo(
        () => (Array.isArray(rawRoles) ? rawRoles : []).map((r) => String(r)),
        [rawRoles],
    );
    const rawPerms = user?.permissions ?? [];
    const permissions = useMemo(
        () => (Array.isArray(rawPerms) ? rawPerms : []).map((p) => String(p)),
        [rawPerms],
    );

    const isSuperAdmin = roles.includes('super_admin');
    const isSchoolAdmin = roles.includes('school_admin') || roles.includes('school_director');
    const isTeacher = roles.includes('teacher');
    const isAccountant = roles.includes('accountant');
    const isParent = roles.includes('parent');

    const isOperationalLead = hasSchool && (isSchoolAdmin || isTeacher || isAccountant);

    const hasPerm = (p: string) => permissions.includes(p);

    const canViewUsers = hasPerm('users.view') || isSuperAdmin || (hasSchool && isSchoolAdmin);
    const canCreateUsers = hasPerm('users.create') || isSuperAdmin || (hasSchool && isSchoolAdmin);
    const canManageRoles =
        hasPerm('roles.manage') || isSuperAdmin || (hasSchool && roles.includes('school_director'));
    const canViewAuditLogs = capabilities?.can_view_audit_logs ?? (isSuperAdmin || hasPerm('audit.view'));

    // Operational school modules (strictly require hasSchool = true)
    const canViewFinance =
        hasSchool &&
        (hasPerm('finance.view') || hasPerm('finance.manage') || isAccountant || isSchoolAdmin);
    const canManageFinance =
        hasSchool && (hasPerm('finance.manage') || isAccountant || isSchoolAdmin);
    const canViewStudents =
        hasSchool &&
        (hasPerm('students.view') || isTeacher || isSchoolAdmin || isAccountant || roles.includes('registrar'));
    const canCreateStudents =
        hasSchool && (hasPerm('students.create') || isSchoolAdmin || roles.includes('registrar'));
    const canEditStudents =
        hasSchool && (hasPerm('students.edit') || isSchoolAdmin || roles.includes('registrar'));
    const canManageAdmissions =
        hasSchool && (hasPerm('admissions.manage') || isSchoolAdmin || roles.includes('registrar'));
    const canCaptureAttendance =
        hasSchool &&
        (hasPerm('attendance.view') || hasPerm('attendance.manage') || isTeacher || isSchoolAdmin);
    const canViewAcademics =
        hasSchool &&
        (hasPerm('assessments.view') ||
            hasPerm('academics.classes.manage') ||
            isTeacher ||
            isSchoolAdmin);
    const canManageAcademics =
        hasSchool && (hasPerm('assessments.manage') || isTeacher || isSchoolAdmin);
    const canViewSchoolSetup =
        hasSchool && (hasPerm('school_setup.view') || hasPerm('school.manage') || isSchoolAdmin);
    const canViewCommunication =
        hasSchool && (hasPerm('communication.manage') || isSchoolAdmin || isTeacher);
    const canViewLibrary =
        hasSchool &&
        (hasPerm('library.view') ||
            hasPerm('library.manage') ||
            roles.includes('librarian') ||
            isSchoolAdmin);
    const canViewHealth =
        hasSchool &&
        (hasPerm('health.view') ||
            hasPerm('health.manage') ||
            roles.includes('nurse') ||
            isSchoolAdmin);
    const canViewDiscipline = hasSchool && (isSchoolAdmin || isTeacher);
    const canViewStaff = hasSchool && isSchoolAdmin;
    const canViewSettings = hasSchool && (hasPerm('settings.manage') || isSchoolAdmin);

    const navCtx = useMemo<NavContext>(
        () => ({
            roles,
            permissions,
            hasSchool,
            isSuperAdmin,
            isOperationalLead,
            canViewUsers,
            canCreateUsers,
            canManageRoles,
            canViewAuditLogs,
            canCaptureAttendance,
            canViewFinance,
            canManageFinance,
            canViewStudents,
            canCreateStudents,
            canEditStudents,
            canManageAdmissions,
            canViewAcademics,
            canManageAcademics,
            canViewSchoolSetup,
            canViewCommunication,
            canViewLibrary,
            canViewHealth,
            canViewDiscipline,
            canViewStaff,
            canViewSettings,
            isParent,
            offlineAttendanceReady: !!capabilities?.offline_attendance_ready,
        }),
        [
            roles,
            permissions,
            hasSchool,
            isSuperAdmin,
            isOperationalLead,
            canViewUsers,
            canCreateUsers,
            canManageRoles,
            canViewAuditLogs,
            canCaptureAttendance,
            canViewFinance,
            canManageFinance,
            canViewStudents,
            canCreateStudents,
            canEditStudents,
            canManageAdmissions,
            canViewAcademics,
            canManageAcademics,
            canViewSchoolSetup,
            canViewCommunication,
            canViewLibrary,
            canViewHealth,
            canViewDiscipline,
            canViewStaff,
            canViewSettings,
            isParent,
            capabilities?.offline_attendance_ready,
        ],
    );

    const { items: navItems, flat: navFlat } = useMemo(
        () => resolveNavigation(navCtx, currentRoute, pageUrl),
        [navCtx, currentRoute, pageUrl],
    );

    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [openBranches, setOpenBranches] = useState<Record<string, boolean>>({});
    const [notifOpen, setNotifOpen] = useState(false);
    const { theme, toggle: toggleTheme } = useTheme();

    useEffect(() => {
        setHydrated(true);
        try {
            const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
            if (stored === 'false') {
                setSidebarExpanded(false);
            }
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        try {
            localStorage.setItem(
                SIDEBAR_STORAGE_KEY,
                sidebarExpanded ? 'true' : 'false',
            );
        } catch {
            /* ignore */
        }
    }, [hydrated, sidebarExpanded]);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const onChange = () => {
            if (mq.matches) {
                setMobileOpen(false);
            }
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        setOpenBranches((prev) => {
            const next = { ...prev };
            for (const item of navItems) {
                if (item.kind === 'branch') {
                    // Auto-expand branch if it contains an active link
                    const hasActiveChild = item.children.some((child) => child.isActive);
                    if (hasActiveChild) {
                        next[item.id] = true;
                    } else if (next[item.id] === undefined) {
                        next[item.id] = false;
                    }
                }
            }
            return next;
        });
    }, [navItems]);

    const toggleSidebar = useCallback(() => {
        setSidebarExpanded((v) => !v);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (
                e.key.toLowerCase() === 'b' &&
                (e.metaKey || e.ctrlKey) &&
                window.matchMedia('(min-width: 768px)').matches
            ) {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggleSidebar]);

    const initials =
        user?.name
            ?.split(' ')
            .map((chunk) => chunk.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'NG';

    const toggleBranch = (id: string) => {
        setOpenBranches((p) => ({
            ...p,
            [id]: !p[id],
        }));
    };

    const renderNavLink = (item: ResolvedNavLeaf, collapsed: boolean) => (
        <Link
            key={item.href + item.name}
            href={item.href}
            title={collapsed ? item.name : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
                'group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-150',
                item.isActive
                    ? 'bg-blue-50/90 text-blue-600 font-semibold dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                collapsed && 'justify-center px-2 py-2',
            )}
        >
            <item.icon
                className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    item.isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200',
                )}
            />
            {!collapsed && (
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate">{item.name}</span>
                    {item.name.toLowerCase().includes('application') ||
                    item.name.toLowerCase().includes('admission') ? (
                        <span className="shrink-0 rounded bg-[#fce7f3] px-1.5 py-0.5 text-[9px] font-bold text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                            4
                        </span>
                    ) : item.highlight ? (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Offline
                        </span>
                    ) : null}
                </span>
            )}
            {collapsed &&
            (item.name.toLowerCase().includes('application') ||
                item.name.toLowerCase().includes('admission')) ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-pink-500" />
            ) : collapsed && item.highlight ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ) : null}
        </Link>
    );

    const renderBranch = (branch: ResolvedNavBranch, collapsed: boolean) => {
        if (collapsed) {
            return (
                <div key={branch.id} className="space-y-1">
                    {branch.children.map((child) => (
                        <div key={child.href + child.name} className="relative">
                            {renderNavLink(child, true)}
                        </div>
                    ))}
                </div>
            );
        }

        const isOpen = openBranches[branch.id] ?? false;

        return (
            <div key={branch.id} className="space-y-0.5">
                <button
                    type="button"
                    onClick={() => toggleBranch(branch.id)}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                >
                    <branch.icon className="h-4 w-4 shrink-0 text-slate-400 opacity-80" />
                    <span className="flex-1 truncate">{branch.name}</span>
                    {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    )}
                </button>
                <div
                    className={cn(
                        'grid transition-[grid-template-rows] duration-200 ease-out',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                >
                    <div className="overflow-hidden">
                        <div className="ml-2 space-y-0.5 border-l border-slate-200 py-1 pl-2.5 dark:border-border">
                            {branch.children.map((child) => (
                                <div key={child.href + child.name} className="relative">
                                    {renderNavLink(child, false)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTopNav = (item: ResolvedNavTop, collapsed: boolean) => {
        if (item.kind === 'branch') {
            return renderBranch(item, collapsed);
        }
        return (
            <div key={item.href + item.name} className="space-y-0.5">
                <div className="relative">{renderNavLink(item, collapsed)}</div>
            </div>
        );
    };

    const unread = demoNotifications.filter((n) => n.unread).length;

    return (
        <div className="flex min-h-screen bg-slate-50/60 dark:bg-background text-[13px]">
            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-800 transition-[transform,width] duration-200 ease-out md:sticky md:top-0 md:z-30 md:w-56 md:translate-x-0 dark:border-border dark:bg-card dark:text-card-foreground',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    !sidebarExpanded && 'md:w-16',
                )}
            >
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-3 dark:border-border">
                    <Link
                        href="/"
                        className={cn(
                            'flex min-w-0 items-center gap-2.5',
                            !sidebarExpanded && 'md:flex-1 md:justify-center',
                        )}
                        onClick={() => setMobileOpen(false)}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                            <School className="h-4 w-4" />
                        </span>
                        {sidebarExpanded ? (
                            <div className="min-w-0">
                                <p className="truncate text-[15px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    Schooling
                                </p>
                                <p className="text-[7.5px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none mt-0.5">
                                    MANAGEMENT PORTAL
                                </p>
                            </div>
                        ) : null}
                    </Link>
                    <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:hover:bg-slate-800"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Section Eyebrow */}
                {sidebarExpanded && (
                    <div className="px-4 pt-3 pb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        WORKSPACE
                    </div>
                )}

                {/* Nav Links */}
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-1">
                    {sidebarExpanded
                        ? navItems.map((item) => renderTopNav(item, false))
                        : navFlat.map((leaf) => (
                              <div key={leaf.href + leaf.name} className="relative">
                                  {renderNavLink(leaf, true)}
                              </div>
                          ))}
                </nav>

                {/* Sidebar Bottom Widgets */}
                <div className="mt-auto border-t border-slate-100 p-2.5 dark:border-border">
                    {sidebarExpanded ? (
                        <div className="mb-2.5 overflow-hidden rounded-xl border border-amber-200/80 bg-[#fef3c7] p-3 text-center dark:border-amber-900/40 dark:bg-amber-950/30">
                            <div className="mb-2 flex items-center justify-center -space-x-1.5">
                                <span className="inline-block h-6 w-6 rounded-full border-2 border-[#fef3c7] bg-slate-300 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces')] bg-cover" />
                                <span className="inline-block h-6 w-6 rounded-full border-2 border-[#fef3c7] bg-slate-300 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces')] bg-cover" />
                                <span className="inline-block h-6 w-6 rounded-full border-2 border-[#fef3c7] bg-slate-300 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces')] bg-cover" />
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#fef3c7] bg-white text-[8px] font-bold text-amber-950 shadow-2xs">
                                    +8
                                </span>
                            </div>
                            <h4 className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-950 dark:text-amber-200">
                                <Sparkles className="h-3 w-3 text-amber-600" /> A brighter school day
                            </h4>
                            <p className="my-1 text-[10px] leading-tight text-amber-800/90 dark:text-amber-300/80">
                                Your school. Your people.<br />All in one place.
                            </p>
                            <Link
                                href="/school-setup"
                                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md border border-amber-300/60 bg-white px-2 py-1 text-[10px] font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-amber-50 dark:bg-card dark:text-foreground"
                            >
                                School insights
                                <ArrowRight className="h-3 w-3 text-slate-500" />
                            </Link>
                        </div>
                    ) : null}

                    {/* Settings Link */}
                    <div className="space-y-0.5">
                        <Link
                            href="/school-setup"
                            className={cn(
                                'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                                !sidebarExpanded && 'justify-center px-2',
                            )}
                            title="Settings"
                        >
                            <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                            {sidebarExpanded && <span>Settings</span>}
                        </Link>
                    </div>

                    {/* School Switcher Badge */}
                    <div className="mt-2 border-t border-slate-100 pt-2 dark:border-border">
                        <div
                            className={cn(
                                'flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                !sidebarExpanded && 'justify-center p-1',
                            )}
                            title={user?.school?.name ?? 'St. Jude Academy'}
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {user?.school?.name ? user.school.name.charAt(0).toUpperCase() : 'S'}
                            </span>
                            {sidebarExpanded ? (
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                        {user?.school?.name ?? 'St. Jude Academy'}
                                    </p>
                                    <p className="text-[9px] font-medium text-slate-400 leading-tight mt-0.5">
                                        2026 - 2027
                                    </p>
                                </div>
                            ) : null}
                            {sidebarExpanded && (
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    title="Collapse sidebar"
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-16 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-xs hover:bg-slate-50 hover:text-slate-900 md:flex dark:border-border dark:bg-card"
                >
                    <PanelLeft
                        className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            !sidebarExpanded && 'rotate-180',
                        )}
                    />
                </button>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur-md sm:gap-3 sm:px-4">
                    <button
                        type="button"
                        className="inline-flex rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted md:inline-flex"
                        title="Toggle sidebar (Ctrl+B)"
                        onClick={toggleSidebar}
                    >
                        <PanelLeft className="h-5 w-5" />
                    </button>

                    <div className="relative hidden min-w-0 flex-1 md:block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search students, invoices, classes…"
                            readOnly
                            className="h-10 w-full max-w-md rounded-xl border border-border bg-muted/40 pl-10 pr-3 text-sm text-foreground outline-none ring-primary/30 transition-shadow placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="inline-flex rounded-lg p-2 text-muted-foreground hover:bg-muted"
                            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setNotifOpen((v) => !v)}
                                className="relative inline-flex rounded-lg p-2 text-muted-foreground hover:bg-muted"
                            >
                                <Bell className="h-5 w-5" />
                                {unread > 0 ? (
                                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                        {unread}
                                    </span>
                                ) : null}
                            </button>
                            {notifOpen ? (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Close notifications"
                                        className="fixed inset-0 z-40 md:hidden"
                                        onClick={() => setNotifOpen(false)}
                                    />
                                    <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                                        <div className="border-b border-border px-4 py-3">
                                            <p className="text-sm font-semibold text-foreground">Notifications</p>
                                            <p className="text-xs text-muted-foreground">Preview data · API later</p>
                                        </div>
                                        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                                            {demoNotifications.map((n) => (
                                                <li
                                                    key={n.id}
                                                    className={cn(
                                                        'px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60',
                                                        n.unread && 'bg-primary/5',
                                                    )}
                                                >
                                                    <p className="font-medium text-foreground">{n.title}</p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="border-t border-border p-2 text-center">
                                            <button
                                                type="button"
                                                className="text-xs font-semibold text-primary hover:underline"
                                                onClick={() => setNotifOpen(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2.5 rounded-full p-1 pr-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <UserAvatar name={user?.name} initials={initials} size="sm" />
                                    <div className="hidden text-left sm:block">
                                        <p className="truncate text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                            {user?.name ?? 'User'}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400 capitalize leading-tight mt-0.5">
                                            {roles[0]?.replace(/_/g, ' ') ?? 'Administrator'}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile settings
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/40"
                                >
                                    Sign out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <div className="flex gap-2 overflow-x-auto border-b border-border bg-card/60 px-3 py-2 text-xs md:hidden">
                    {navFlat.map((item) => (
                        <ResponsiveNavLink
                            key={item.href + item.name}
                            href={item.href}
                            active={item.isActive}
                        >
                            <span className="whitespace-nowrap font-semibold">{item.name}</span>
                        </ResponsiveNavLink>
                    ))}
                </div>

                {header ? (
                    <div className="border-b border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                ) : null}

                <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                    {/* Page Path Breadcrumbs (Schoolname / Section / Page) */}
                    <nav aria-label="Breadcrumb" className="mb-3.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <Link
                            href="/dashboard"
                            className="font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                        >
                            {schoolName}
                        </Link>
                        {activeBreadcrumbs.map((crumb, idx) => (
                            <Fragment key={idx}>
                                <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {crumb.label}
                                    </span>
                                )}
                            </Fragment>
                        ))}
                    </nav>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRoute + pageUrl}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <footer className="mt-auto border-t border-border bg-card/50 px-4 py-3 text-center text-[11px] text-muted-foreground md:hidden">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <ApplicationLogo className="h-6 fill-current text-foreground" />
                    </Link>
                </footer>
            </div>
        </div>
    );
}
