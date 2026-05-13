import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
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
    Bell,
    ChevronDown,
    ChevronRight,
    Globe,
    Menu,
    Moon,
    PanelLeft,
    Search,
    Sun,
    X,
} from 'lucide-react';
import {
    PropsWithChildren,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

const SIDEBAR_STORAGE_KEY = 'ng-admin-sidebar-expanded';

const demoNotifications = [
    { id: 1, title: 'New payment posted', detail: 'MWK 85,000 · Thandiwe Banda', unread: true },
    { id: 2, title: 'Attendance below threshold', detail: 'Grade 9B · 87%', unread: true },
    { id: 3, title: 'Exam timetable published', detail: 'Term 2 midterms', unread: false },
];

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, capabilities } = usePage<PageProps>().props;
    const page = usePage<PageProps>();
    const pageUrl = page.url;
    const currentRoute = route().current();

    const user = auth.user as AuthUser | null;
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

    const isOperationalLead = roles.some((role) =>
        ['super_admin', 'school_director', 'school_admin', 'teacher', 'accountant'].includes(role),
    );
    const canCaptureAttendance = roles.some((role) =>
        ['super_admin', 'school_director', 'school_admin', 'teacher'].includes(role),
    );
    const isParent = roles.includes('parent');

    const adminLikeRoles = ['super_admin', 'school_director', 'school_admin'];
    const canViewUsers =
        permissions.includes('users.view') || roles.some((r) => adminLikeRoles.includes(r));
    const canCreateUsers =
        permissions.includes('users.create') || roles.some((r) => adminLikeRoles.includes(r));
    const canManageRoles =
        permissions.includes('roles.manage') ||
        roles.includes('super_admin') ||
        roles.includes('school_director');

    const isSuperAdmin = roles.includes('super_admin');
    const canViewAuditLogs = capabilities?.can_view_audit_logs ?? isSuperAdmin;

    const navCtx = useMemo<NavContext>(
        () => ({
            roles,
            isSuperAdmin,
            isOperationalLead,
            canViewUsers,
            canCreateUsers,
            canManageRoles,
            canViewAuditLogs,
            canCaptureAttendance,
            isParent,
            offlineAttendanceReady: !!capabilities?.offline_attendance_ready,
        }),
        [
            roles,
            isSuperAdmin,
            isOperationalLead,
            canViewUsers,
            canCreateUsers,
            canManageRoles,
            canViewAuditLogs,
            canCaptureAttendance,
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
                    if (next[item.id] === undefined) {
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
        setOpenBranches((p) => {
            const isCurrentlyOpen = !!p[id];
            if (isCurrentlyOpen) {
                return { ...p, [id]: false };
            }
            // Close all others and open this one
            return { [id]: true };
        });
    };

    const renderNavLink = (item: ResolvedNavLeaf, collapsed: boolean) => (
        <Link
            key={item.href + item.name}
            href={item.href}
            title={collapsed ? item.name : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                item.isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
            )}
        >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate">{item.name}</span>
                    {item.highlight ? (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Offline
                        </span>
                    ) : null}
                </span>
            )}
            {collapsed && item.highlight ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
            ) : null}
        </Link>
    );

    const renderBranch = (branch: ResolvedNavBranch, collapsed: boolean) => {
        if (collapsed) {
            return (
                <div key={branch.id} className="space-y-1 px-2">
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
            <div key={branch.id} className="px-2">
                <button
                    type="button"
                    onClick={() => toggleBranch(branch.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                    <branch.icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="flex-1 truncate">{branch.name}</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                    ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                    )}
                </button>
                <div
                    className={cn(
                        'grid transition-[grid-template-rows] duration-200 ease-out',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                >
                    <div className="overflow-hidden">
                        <div className="ml-2 space-y-0.5 border-l border-sidebar-border py-1 pl-3">
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
            <div key={item.href + item.name} className="space-y-1 px-2">
                <div className="relative">{renderNavLink(item, collapsed)}</div>
            </div>
        );
    };

    const unread = demoNotifications.filter((n) => n.unread).length;

    return (
        <div className="flex min-h-screen bg-muted/40">
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
                    'fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition-[transform,width] duration-200 ease-out md:sticky md:top-0 md:z-30 md:w-64 md:translate-x-0 md:shadow-none',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    !sidebarExpanded && 'md:w-[4.5rem]',
                )}
            >
                <div className="flex items-center justify-between border-b border-sidebar-border p-4">
                    <Link
                        href="/"
                        className={cn(
                            'flex min-w-0 items-center gap-3',
                            !sidebarExpanded && 'md:flex-1 md:justify-center',
                        )}
                        onClick={() => setMobileOpen(false)}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md">
                            NG
                        </span>
                        {sidebarExpanded ? (
                            <div className="min-w-0 md:block">
                                <p className="truncate text-sm font-bold tracking-tight">
                                    NextGen Schools
                                </p>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                                    Enterprise ERP
                                </p>
                            </div>
                        ) : null}
                    </Link>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent md:hidden"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-2 overflow-y-auto py-3">
                    {sidebarExpanded
                        ? navItems.map((item) => renderTopNav(item, false))
                        : navFlat.map((leaf) => (
                              <div key={leaf.href + leaf.name} className="px-2">
                                  {renderNavLink(leaf, true)}
                              </div>
                          ))}
                </nav>

                <div className="border-t border-sidebar-border p-3">
                    <div
                        className={cn(
                            'rounded-xl border border-sidebar-border bg-card p-4 text-card-foreground shadow-sm',
                            !sidebarExpanded &&
                                'md:flex md:flex-col md:items-center md:p-2 md:text-center',
                        )}
                    >
                        <p
                            className={cn(
                                'text-[10px] font-bold uppercase tracking-widest text-muted-foreground',
                                !sidebarExpanded && 'md:sr-only',
                            )}
                        >
                            Active tenant
                        </p>
                        {sidebarExpanded ? (
                            <p
                                className="mt-1 truncate text-sm font-bold"
                                title={user?.school?.name ?? 'Platform scope'}
                            >
                                {user?.school?.name ?? 'Platform scope'}
                            </p>
                        ) : (
                            <div
                                className="mt-1 flex justify-center md:mt-0"
                                title={user?.school?.name ?? 'Platform scope'}
                            >
                                <Globe className="h-5 w-5 text-primary" aria-hidden />
                            </div>
                        )}
                        {user?.school?.timezone && sidebarExpanded ? (
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                TZ · {user.school.timezone}
                            </p>
                        ) : null}
                    </div>
                </div>

                <button
                    type="button"
                    title="Collapse sidebar"
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 hidden h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted md:flex"
                >
                    <PanelLeft
                        className={cn(
                            'h-4 w-4 transition-transform',
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
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted sm:px-3"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                        {initials}
                                    </span>
                                    <span className="hidden max-w-[10rem] truncate sm:inline">
                                        Account
                                    </span>
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

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
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
