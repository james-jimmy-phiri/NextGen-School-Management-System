import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: '🏫',
        title: 'Multi-School Management',
        description:
            'Manage unlimited school branches from a single platform with isolated tenant contexts, role-scoped dashboards, and per-school configuration.',
    },
    {
        icon: '📊',
        title: 'Real-time Analytics',
        description:
            'Attendance pulse, grade trends, open receivables, and staff metrics — all refreshed live with offline-resilient data sync for rural connectivity.',
    },
    {
        icon: '👨‍👩‍👧',
        title: 'Parent & Guardian Portal',
        description:
            'Multi-child household views, fee transparency, and secure homeroom messaging. SMS/e-mail/push bridges for reliable communication.',
    },
    {
        icon: '📋',
        title: 'Attendance Engine',
        description:
            'Manual, QR-code, biometric, and NFC capture modes. Mobile clients sync offline snapshots and reconcile with conflict clocks when back online.',
    },
    {
        icon: '📝',
        title: 'Grading & Transcripts',
        description:
            'Weighted GPA with multi-term rollups, printable report cards, PDF exports, and anonymized class-rank benchmarks.',
    },
    {
        icon: '💰',
        title: 'Finance & Receivables',
        description:
            'Installment plans, mobile-money integrations, bank feed reconciliation, and Postgres-backed ledger with full audit trail.',
    },
];

const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 200ms', label: 'API response' },
    { value: 'Offline-first', label: 'Architecture' },
    { value: 'Multi-tenant', label: 'Isolation' },
];

export default function Welcome({
    auth,
    schools = [],
}: PageProps<{ laravelVersion: string; phpVersion: string; schools?: { id: number; name: string; slug: string; city?: string; country?: string }[] }>) {
    return (
        <>
            <Head title="NextGen School Management System" />

            <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
                {/* ── Navigation ── */}
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-bold text-white shadow-lg shadow-indigo-500/40">
                                NG
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-white">NextGen Schools</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/40">
                                    Enterprise Platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-white/90"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section className="relative overflow-hidden pt-32 pb-24">
                    {/* Background glow */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -top-40 flex justify-center overflow-hidden"
                    >
                        <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/20 blur-[120px]" />
                    </div>

                    <div className="relative mx-auto max-w-5xl px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                Production-ready · Enterprise-grade
                            </span>

                            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                                The future of{' '}
                                <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                    school management
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
                                NextGen School Management System unifies admissions, attendance,
                                grading, finance, and parent communication into one
                                offline-resilient platform built for Africa's most demanding
                                connectivity environments.
                            </p>

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-sky-400"
                                    >
                                        Open Command Center →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('public.admissions.create')}
                                            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-sky-400"
                                        >
                                            Apply for admission →
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Parent / staff sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Stats bar ── */}
                <section className="border-y border-white/10 bg-white/[0.03]">
                    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                                className="flex flex-col items-center justify-center px-6 py-8 text-center"
                            >
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-white/40">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Features grid ── */}
                <section className="py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Platform capabilities
                            </p>
                            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                                Everything a modern school needs
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-white/50">
                                Built with Laravel, React, and TypeScript — designed for
                                administrators, teachers, parents, and accountants.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + i * 0.08 }}
                                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-indigo-500/40 hover:bg-indigo-500/5"
                                >
                                    <span className="text-3xl" role="img" aria-label={feature.title}>
                                        {feature.icon}
                                    </span>
                                    <h3 className="mt-4 text-base font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {schools.length > 0 && (
                    <section className="border-t border-white/10 py-20">
                        <div className="mx-auto max-w-4xl px-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Apply online
                            </p>
                            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                                Start your child&apos;s application
                            </h2>
                            <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
                                Select your school to open the branded admissions form, or track an existing application.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                                {schools.map((s) => (
                                    <Link
                                        key={s.id}
                                        href={route('public.admissions.create', { school: s.slug })}
                                        className="rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-left transition hover:border-indigo-400/50 hover:bg-indigo-500/10"
                                    >
                                        <span className="block font-semibold text-white">{s.name}</span>
                                        {(s.city || s.country) && (
                                            <span className="mt-1 block text-xs text-white/40">
                                                {[s.city, s.country].filter(Boolean).join(', ')}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={route('public.admissions.track')}
                                className="mt-6 inline-block text-sm font-medium text-indigo-300 hover:text-indigo-200"
                            >
                                Track application status →
                            </Link>
                        </div>
                    </section>
                )}

                {/* ── CTA ── */}
                <section className="pb-24">
                    <div className="mx-auto max-w-2xl px-6 text-center">
                        <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-600/20 to-transparent p-12">
                            <h2 className="text-3xl font-bold text-white">
                                Ready to transform your school?
                            </h2>
                            <p className="mt-4 text-white/60">
                                Join schools across Africa already running on NextGen.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-500"
                                    >
                                        Open Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-500"
                                        >
                                            Create your account
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="rounded-2xl border border-white/20 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-white/10 py-8 text-center text-xs text-white/30">
                    <p>
                        NextGen School Management System · Built with Laravel &amp; React
                        (Inertia) · TypeScript
                    </p>
                </footer>
            </div>
        </>
    );
}
