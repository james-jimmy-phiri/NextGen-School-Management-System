import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Bell,
    CalendarDays,
    FileText,
    Home,
    Megaphone,
    MessageCircle,
    Moon,
    Sun,
    Wallet,
    Activity,
    BookOpen,
    Clock,
    HeartPulse,
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import type { PageProps, AuthUser } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

type PortalContext = {
    children: { id: number; first_name: string; last_name: string; photo_path?: string | null }[];
    activeStudentId: number | null;
};

const GLOBAL_NAV = [
    { name: 'Dashboard', href: 'portal.parent', icon: Home, needsStudent: false },
    { name: 'Messages', href: 'portal.messages', icon: MessageCircle, needsStudent: false },
    { name: 'Announcements', href: 'portal.announcements', icon: Megaphone, needsStudent: false },
    { name: 'Calendar', href: 'portal.calendar', icon: CalendarDays, needsStudent: false },
];

const CHILD_NAV = [
    { name: 'Overview', href: 'portal.children.show', icon: Home, matchPrefix: false },
    { name: 'Academics', href: 'portal.children.academics', icon: BookOpen, matchPrefix: true },
    { name: 'Attendance', href: 'portal.children.attendance', icon: Clock, matchPrefix: true },
    { name: 'Finances', href: 'portal.children.fees', icon: Wallet, matchPrefix: true },
    { name: 'Behaviour', href: 'portal.children.behaviour', icon: Activity, matchPrefix: true },
    { name: 'Health', href: 'portal.children.health', icon: HeartPulse, matchPrefix: true },
    { name: 'Documents', href: 'portal.children.documents', icon: FileText, matchPrefix: true },
    { name: 'Timetable', href: 'portal.children.timetable', icon: CalendarDays, matchPrefix: true },
];

export default function PortalLayout({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
    const { auth, portal } = usePage<PageProps & { portal?: PortalContext | null }>().props;
    const user = auth.user as AuthUser;
    const { theme, toggle: toggleTheme } = useTheme();
    const currentRoute = route().current();
    const [scrolled, setScrolled] = useState(false);

    const studentId =
        portal?.activeStudentId ??
        portal?.children?.[0]?.id ??
        null;

    const portalHref = (routeName: string, needsStudent: boolean) => {
        if (!needsStudent) {
            return route(routeName);
        }
        if (!studentId) {
            return route('portal.parent');
        }
        return route(routeName, studentId);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const initials =
        user?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'P';

    const isCurrent = (routeName: string, matchPrefix = false) => {
        if (!currentRoute) return false;
        if (matchPrefix) {
            const base = routeName.split('.').slice(0, 3).join('.');
            return currentRoute.startsWith(base);
        }
        return currentRoute === routeName;
    };

    const schoolLogo = user?.school?.logo_path
        ? `/storage/${user.school.logo_path}`
        : null;

    return (
        <div className="flex min-h-screen flex-col bg-muted/30 pb-16 md:flex-row md:pb-0">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card shadow-sm md:flex">
                <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
                    {schoolLogo ? (
                        <img src={schoolLogo} alt="" className="h-9 w-9 rounded-lg object-contain" />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <ApplicationLogo className="h-5 w-5 fill-current" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold tracking-tight truncate">Parent Portal</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                            {user?.school?.name || 'Your school'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Portal
                    </p>
                    <nav className="flex flex-col gap-1">
                        {GLOBAL_NAV.map((item) => {
                            const active = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={portalHref(item.href, item.needsStudent)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        active
                                            ? 'bg-primary/10 text-primary shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    <item.icon
                                        className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {studentId && (
                        <>
                            <p className="mb-2 mt-8 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                My child
                            </p>
                            <nav className="flex flex-col gap-1">
                                {CHILD_NAV.map((item) => {
                                    const active = isCurrent(item.href, item.matchPrefix);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={portalHref(item.href, true)}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                                active
                                                    ? 'bg-primary/10 text-primary shadow-sm'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    'h-4 w-4',
                                                    active ? 'text-primary' : 'text-muted-foreground',
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </>
                    )}

                    {!studentId && portal?.children?.length === 0 && (
                        <p className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 px-3 py-4 text-xs text-muted-foreground">
                            No linked children yet. Contact the school registrar if you expected access.
                        </p>
                    )}
                </div>

                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                            {initials}
                        </span>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-bold">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">Guardian</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col md:pl-64">
                <header
                    className={cn(
                        'sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 px-4 transition-all duration-200 sm:px-6 md:px-8',
                        scrolled ? 'bg-card/80 shadow-sm backdrop-blur-md' : 'bg-transparent',
                    )}
                >
                    <div className="flex items-center md:hidden">
                        {schoolLogo ? (
                            <img src={schoolLogo} alt="" className="h-8 w-8 rounded-lg object-contain" />
                        ) : (
                            <ApplicationLogo className="h-6 w-auto fill-current text-primary" />
                        )}
                        <span className="ml-2 text-sm font-bold tracking-tight">Parent Portal</span>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm ring-1 ring-border hover:bg-muted"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex h-9 items-center gap-2 rounded-full bg-card pl-1 pr-3 text-sm font-medium text-foreground shadow-sm ring-1 ring-border hover:bg-muted md:h-10"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary md:h-8 md:w-8 md:text-xs">
                                        {initials}
                                    </span>
                                    <span className="hidden md:block">Account</span>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right">
                                <Dropdown.Link href={route('portal.profile')}>Profile & Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600">
                                    Sign out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6 md:px-8">
                    {header && <div className="mb-8">{header}</div>}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRoute}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-border bg-card/90 pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] backdrop-blur-md md:hidden">
                <div className="flex h-16 justify-around px-2">
                    {[
                        GLOBAL_NAV[0],
                        ...(studentId ? [CHILD_NAV[1], CHILD_NAV[2], CHILD_NAV[3]] : []),
                        GLOBAL_NAV[1],
                    ].map((item) => {
                        const active = isCurrent(item.href, 'matchPrefix' in item ? item.matchPrefix : false);
                        return (
                            <Link
                                key={item.name}
                                href={portalHref(item.href, item.name !== 'Dashboard' && item.name !== 'Messages')}
                                className={cn(
                                    'flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors',
                                    active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                                        active ? 'bg-primary/10' : 'bg-transparent',
                                    )}
                                >
                                    <item.icon className={cn('h-5 w-5', active ? 'scale-110' : '')} />
                                </span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
