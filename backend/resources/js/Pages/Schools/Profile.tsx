import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Mail, Phone, Globe, Calendar, Users, Building2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

type AcademicYear = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
};

type Department = {
    id: number;
    name: string;
    type: string;
    description: string | null;
};

type SchoolProfileData = {
    id: number;
    name: string;
    slug: string;
    timezone: string | null;
    locale: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    city: string | null;
    country: string | null;
    postal_address: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    currency: string | null;
    is_active: boolean;
    logo_url?: string | null;
};

export default function SchoolProfile({
    school,
    currentAcademicYear,
    departments,
}: PageProps<{
    school: SchoolProfileData;
    currentAcademicYear: AcademicYear | null;
    departments: Department[];
}>) {
    const primaryColor = school.primary_color ?? '#0f172a';
    const secondaryColor = school.secondary_color ?? '#3b82f6';

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            My School
                        </p>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            School Profile
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Profile — ${school.name}`} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-6xl space-y-6"
            >
                {/* Hero Header Card */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                    <div
                        className="absolute inset-x-0 top-0 h-32 opacity-20"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                    />
                    <div className="relative flex flex-col items-center gap-6 px-8 py-10 sm:flex-row sm:items-start">
                        {/* Logo */}
                        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-md ring-1 ring-slate-100">
                            {school.logo_url ? (
                                <img
                                    src={school.logo_url}
                                    alt={`${school.name} logo`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <Building2 className="h-12 w-12 text-slate-300" />
                            )}
                        </div>

                        {/* Title & Status */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-slate-900">{school.name}</h1>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                    <span className="font-mono text-slate-500">{school.slug}</span>
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        school.is_active
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            school.is_active ? 'bg-emerald-500' : 'bg-red-500'
                                        }`}
                                    />
                                    {school.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Action / Stats Placeholder */}
                        <div className="flex flex-col items-end gap-2 text-right">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Setup Status
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full bg-emerald-500"
                                        style={{ width: '80%' }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-700">80%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Current Academic Year */}
                        <motion.div
                            variants={itemVariants}
                            className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg"
                        >
                            <div className="relative p-8">
                                <div className="absolute right-0 top-0 opacity-10 blur-3xl">
                                    <div className="h-48 w-48 rounded-full bg-blue-500" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-300">
                                            <Calendar className="h-5 w-5" />
                                            <h3 className="font-medium">Current Academic Year</h3>
                                        </div>
                                        {currentAcademicYear ? (
                                            <div className="mt-4">
                                                <p className="text-3xl font-bold tracking-tight">
                                                    {currentAcademicYear.name}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    {new Date(currentAcademicYear.start_date).toLocaleDateString()} —{' '}
                                                    {new Date(currentAcademicYear.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-4">
                                                <p className="text-lg font-medium text-slate-300">
                                                    No active academic year configured.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden rounded-full bg-white/10 p-4 sm:block backdrop-blur-sm">
                                        <Calendar className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                        >
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <MapPin className="h-5 w-5 text-slate-400" />
                                Contact &amp; Location
                            </h3>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900">Email Address</p>
                                            <p className="text-slate-600">{school.email || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900">Phone Number</p>
                                            <p className="text-slate-600">{school.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900">Website</p>
                                            <p className="text-slate-600">
                                                {school.website ? (
                                                    <a href={school.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                        {school.website}
                                                    </a>
                                                ) : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm border-t border-slate-100 pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                                    <div>
                                        <p className="font-medium text-slate-900 mb-1">Physical Address</p>
                                        <p className="text-slate-600">
                                            {school.address}<br />
                                            {[school.city, school.country].filter(Boolean).join(', ')}
                                        </p>
                                        {!school.address && !school.city && <p className="text-slate-400">Not provided</p>}
                                    </div>
                                    {school.postal_address && (
                                        <div>
                                            <p className="font-medium text-slate-900 mb-1">Postal Address</p>
                                            <p className="text-slate-600">{school.postal_address}</p>
                                        </div>
                                    )}
                                    <div className="pt-2">
                                        <p className="font-medium text-slate-900 mb-1">Localization</p>
                                        <p className="text-slate-600 text-xs">
                                            Timezone: {school.timezone || 'UTC'} &middot; Currency: {school.currency || 'USD'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Branding Details */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                                <Palette className="h-5 w-5 text-slate-400" />
                                Branding Identity
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Primary Color</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-lg shadow-inner ring-1 ring-slate-200"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                        <span className="font-mono text-sm text-slate-700">{primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Secondary Color</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-lg shadow-inner ring-1 ring-slate-200"
                                            style={{ backgroundColor: secondaryColor }}
                                        />
                                        <span className="font-mono text-sm text-slate-700">{secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Departments Widget */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                                    <Users className="h-5 w-5 text-slate-400" />
                                    Departments
                                </h3>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                                    {departments.length}
                                </span>
                            </div>
                            
                            {departments.length > 0 ? (
                                <ul className="space-y-3">
                                    {departments.map((dept) => (
                                        <li
                                            key={dept.id}
                                            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900 text-sm">{dept.name}</p>
                                                <p className="text-xs text-slate-500 capitalize">{dept.type}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                                    <p className="text-sm text-slate-500">No departments configured.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
