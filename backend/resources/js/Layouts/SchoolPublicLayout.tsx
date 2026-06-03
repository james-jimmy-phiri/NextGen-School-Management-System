import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SchoolBrandingProps {
    id?: number | null;
    name: string;
    slug?: string | null;
    logo_url?: string | null;
    primary_color?: string;
    secondary_color?: string;
    motto?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    city?: string | null;
    country?: string | null;
}

interface SchoolPublicLayoutProps extends PropsWithChildren {
    school: SchoolBrandingProps;
    title?: string;
    subtitle?: string;
    wide?: boolean;
}

export default function SchoolPublicLayout({
    children,
    school,
    title,
    subtitle,
    wide = false,
}: SchoolPublicLayoutProps) {
    const primary = school.primary_color || '#1e40af';
    const secondary = school.secondary_color || '#0ea5e9';
    const applyHref = school.slug
        ? route('public.admissions.create', { school: school.slug })
        : route('public.admissions.create');
    const trackHref = route('public.admissions.track');

    return (
        <div
            className="min-h-screen bg-slate-50 text-slate-900"
            style={
                {
                    '--school-primary': primary,
                    '--school-secondary': secondary,
                } as React.CSSProperties
            }
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-90"
                style={{
                    background: `linear-gradient(135deg, ${primary}18 0%, ${secondary}12 50%, transparent 100%)`,
                }}
            />

            <header className="relative z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link href="/" className="group flex min-w-0 items-center gap-3">
                        {school.logo_url ? (
                            <img
                                src={school.logo_url}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1 shadow-sm"
                            />
                        ) : (
                            <span
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md"
                                style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
                            >
                                {school.name.charAt(0)}
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                                {school.name}
                            </p>
                            {school.motto && (
                                <p className="truncate text-xs text-slate-500">{school.motto}</p>
                            )}
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 sm:flex">
                        <Link
                            href={applyHref}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            Apply
                        </Link>
                        <Link
                            href={trackHref}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            Track application
                        </Link>
                        <Link
                            href={route('login')}
                            className="ml-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                            style={{ backgroundColor: primary }}
                        >
                            Parent / staff sign in
                        </Link>
                    </nav>
                </div>
            </header>

            {(title || subtitle) && (
                <div className="relative z-10 border-b border-slate-200/60 bg-white/60">
                    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm ring-1 ring-slate-200">
                                <GraduationCap className="h-3.5 w-3.5" style={{ color: primary }} />
                                Admissions
                            </div>
                            {title && (
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="mt-2 max-w-2xl text-base text-slate-600">{subtitle}</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}

            <main className="relative z-10">
                <div
                    className={cn(
                        'mx-auto px-4 py-10 sm:px-6',
                        wide ? 'max-w-6xl' : 'max-w-3xl',
                    )}
                >
                    {children}
                </div>
            </main>

            <footer className="relative z-10 mt-16 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                            <p className="font-bold text-slate-900">{school.name}</p>
                            {school.motto && (
                                <p className="mt-1 text-sm text-slate-500">{school.motto}</p>
                            )}
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            {(school.address || school.city) && (
                                <p className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                    <span>
                                        {[school.address, school.city, school.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                </p>
                            )}
                            {school.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                    <a href={`tel:${school.phone}`} className="hover:text-slate-900">
                                        {school.phone}
                                    </a>
                                </p>
                            )}
                            {school.email && (
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                    <a href={`mailto:${school.email}`} className="hover:text-slate-900">
                                        {school.email}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                        Powered by NextGen School Management · {new Date().getFullYear()}
                    </p>
                </div>
            </footer>

            <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden">
                <Link href={applyHref} className="flex flex-1 flex-col items-center py-3 text-xs font-medium text-slate-600">
                    Apply
                </Link>
                <Link href={trackHref} className="flex flex-1 flex-col items-center py-3 text-xs font-medium text-slate-600">
                    Track
                </Link>
                <Link
                    href={route('login')}
                    className="flex flex-1 flex-col items-center py-3 text-xs font-semibold"
                    style={{ color: primary }}
                >
                    Sign in
                </Link>
            </nav>
            <div className="h-16 sm:hidden" />
        </div>
    );
}
