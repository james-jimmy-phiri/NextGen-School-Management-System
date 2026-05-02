import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import type { AuthUser, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

type NavItem = {
    name: string;
    href: string;
    highlight?: boolean;
    isActive?: (current?: string | null) => boolean;
};

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, capabilities } = usePage<PageProps>().props;
    const currentRoute = route().current();

    const user = auth.user as AuthUser | null;
    const roles = user?.roles ?? [];

    const isOperationalLead = roles.some((role) =>
        ['super_admin', 'school_admin', 'teacher', 'accountant'].includes(
            role,
        ),
    );
    const canCaptureAttendance = roles.some((role) =>
        ['super_admin', 'school_admin', 'teacher'].includes(role),
    );
    const isParent = roles.includes('parent');

    const navigation: NavItem[] = [
        {
            name: 'Command center',
            href: route('dashboard'),
            isActive: () => currentRoute === 'dashboard',
        },
    ];

    if (isOperationalLead) {
        navigation.push(
            {
                name: 'Schools',
                href: route('schools.index'),
                isActive: (current = currentRoute) =>
                    !!current?.startsWith('schools.'),
            },
            {
                name: 'Students',
                href: route('students.index'),
                isActive: (current = currentRoute) =>
                    !!current?.startsWith('students.'),
            },
        );
    }

    if (canCaptureAttendance) {
        navigation.push({
            name: 'Attendance',
            href: route('attendance.index'),
            highlight: !!capabilities?.offline_attendance_ready,
            isActive: (current = currentRoute) =>
                !!current?.startsWith('attendance.'),
        });
    }

    if (isParent) {
        navigation.push({
            name: 'Parent portal',
            href: route('portal.parent'),
            isActive: (current = currentRoute) =>
                current === 'portal.parent',
        });
    }

    const initials =
        user?.name
            ?.split(' ')
            .map((chunk) => chunk.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'NG';

    return (
        <div className="min-h-screen bg-slate-950/5 lg:flex">
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-900/10 bg-white px-5 py-8 shadow-xl shadow-slate-900/10 lg:flex lg:flex-col">
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                        NG
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            NextGen Schools
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                            Enterprise
                        </p>
                    </div>
                </Link>

                <div className="mt-12 space-y-2">
                    <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Modules
                    </p>
                    {navigation.map((item) => {
                        const active = item.isActive?.() ?? false;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                }`}
                            >
                                <span>{item.name}</span>
                                {item.highlight ? (
                                    <span className="rounded-full bg-emerald-400/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-950">
                                        Offline
                                    </span>
                                ) : null}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto space-y-5 rounded-3xl bg-slate-900 p-5 text-xs text-white">
                    <div>
                        <p className="uppercase tracking-wide text-white/70">
                            Active tenant
                        </p>
                        <p className="mt-1 text-xl font-semibold leading-tight">
                            {user?.school?.name ?? 'Platform scope'}
                        </p>
                        {user?.school?.timezone ? (
                            <p className="text-white/60">
                                TZ · {user.school.timezone}
                            </p>
                        ) : null}
                    </div>
                    <p className="text-white/70">
                        Postgres-backed ledger, audited finance events, SMS-ready comms templates, and
                        queue-isolated payloads for unreliable networks.
                    </p>
                </div>
            </aside>

            <div className="flex-1 bg-slate-50">
                <nav className="border-b border-slate-900/10 bg-white/95 shadow-sm lg:hidden">
                    <div className="mx-auto flex items-center justify-between px-4 py-4">
                        <Link href="/">
                            <ApplicationLogo className="h-10 fill-current text-slate-900" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                                        Navigate
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    {navigation.map((item) => (
                                        <Dropdown.Link key={item.href} href={item.href}>
                                            {item.name}
                                        </Dropdown.Link>
                                    ))}
                                </Dropdown.Content>
                            </Dropdown>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-semibold text-white shadow">
                                {initials}
                            </span>
                        </div>
                    </div>
                </nav>

                <nav className="hidden border-b border-white/70 bg-white/90 shadow-sm lg:block">
                    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-start sm:justify-between lg:max-w-none lg:flex-row lg:px-12 xl:max-w-none">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Authenticated workspace
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                                {user?.name}
                            </h1>
                            <p className="text-sm text-slate-600">{user?.email}</p>
                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide">
                                {(user?.roles ?? []).map((role) => (
                                    <span
                                        key={role}
                                        className="rounded-full bg-slate-900/95 px-3 py-1 text-white"
                                    >
                                        {role.replaceAll('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center rounded-full border border-transparent bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-slate-900/15 ring-1 ring-slate-200">
                                        Workspace menu
                                        <svg
                                            className="ms-3 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m6 9 6 6 6-6"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile & security controls
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Sign out securely
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </nav>

                <div className="flex gap-4 overflow-x-auto border-b border-white/70 bg-white/90 px-4 py-4 text-sm lg:hidden">
                    {navigation.map((item) => (
                        <ResponsiveNavLink
                            key={item.href}
                            href={item.href}
                            active={item.isActive?.() ?? false}
                        >
                            <span>{item.name}</span>
                            {item.highlight ? (
                                <span className="ms-2 inline-flex rounded-full bg-emerald-100 px-2 py-[2px] text-[10px] font-semibold text-emerald-700">
                                    Sync
                                </span>
                            ) : null}
                        </ResponsiveNavLink>
                    ))}
                </div>

                {header ? (
                    <header className="border-b border-slate-100 bg-white/95">
                        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:max-w-none lg:px-12">{header}</div>
                    </header>
                ) : null}

                <main className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:max-w-none lg:px-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
