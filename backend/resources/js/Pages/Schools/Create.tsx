import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Globe,
    GraduationCap,
    MapPin,
    Navigation,
    Phone,
    School,
    Shield,
    Upload,
    Users,
    X,
} from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
    // Step 1 — Identity
    name: string;
    short_name: string;
    slug: string;
    motto: string;
    registration_number: string;
    school_type: string;
    ownership: string;
    year_established: string;
    education_level: string;
    logo: File | null;
    // Step 2 — Contact & Location
    email: string;
    phone: string;
    alt_phone: string;
    website: string;
    address: string;
    postal_address: string;
    city: string;
    district: string;
    region: string;
    country: string;
    gps_lat: string;
    gps_lng: string;
    // Step 3 — Leadership
    principal_name: string;
    deputy_principal_name: string;
    director_name: string;
    administrator_name: string;
    bursar_name: string;
    academic_director_name: string;
    // Step 4 — System
    timezone: string;
    locale: string;
    primary_color: string;
    secondary_color: string;
    currency: string;
    is_active: boolean;
};

// ─── Wizard step config ───────────────────────────────────────────────────────

const STEPS = [
    { id: 1, label: 'Identity',    icon: School,    description: 'Official names & classification' },
    { id: 2, label: 'Contact',     icon: MapPin,     description: 'Address & communication' },
    { id: 3, label: 'Leadership',  icon: Users,      description: 'Key personnel' },
    { id: 4, label: 'System',      icon: Shield,     description: 'Branding & configuration' },
];

// ─── Reusable UI helpers ──────────────────────────────────────────────────────

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
    return (
        <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
            {children}{required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
    );
}

function Input({
    id, type = 'text', value, onChange, placeholder, error, className = '', ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
    return (
        <div>
            <input
                id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
                className={`block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                    focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15
                    dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 transition-all ${className}`}
                {...rest}
            />
            {error && <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>}
        </div>
    );
}

function Select({
    id, value, onChange, options, placeholder, error, className = ''
}: {
    id: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>;
    options: { value: string; label: string }[]; placeholder?: string; error?: string; className?: string;
}) {
    return (
        <div>
            <select id={id} value={value} onChange={onChange}
                className={`block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900
                    focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15
                    dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all ${className}`}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {error && <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>}
        </div>
    );
}

function FieldRow({ children, span = 1 }: { children: React.ReactNode; span?: 1 | 2 }) {
    return <div className={span === 2 ? 'md:col-span-2' : ''}>{children}</div>;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="relative">
            {/* Progress bar track */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 mx-10" aria-hidden>
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
                />
            </div>

            <ol className="relative flex items-start justify-between">
                {STEPS.map((step) => {
                    const done = step.id < current;
                    const active = step.id === current;
                    return (
                        <li key={step.id} className="flex flex-col items-center gap-2 flex-1">
                            {/* Circle */}
                            <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                done
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : active
                                    ? 'border-blue-500 bg-white dark:bg-slate-900 text-blue-600 shadow-md shadow-blue-500/20'
                                    : 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-400'
                            }`}>
                                {done ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <step.icon className="h-4.5 w-4.5" />
                                )}
                            </div>
                            {/* Labels */}
                            <div className="text-center hidden sm:block">
                                <p className={`text-[11px] font-bold leading-none transition-colors ${
                                    active ? 'text-blue-600 dark:text-blue-400' : done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                                }`}>{step.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.description}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

// ─── Individual Step panels ───────────────────────────────────────────────────

function Step1Identity({
    data, setData, errors, logoPreview, fileRef, onLogoChange,
}: {
    data: FormData;
    setData: (key: keyof FormData, val: any) => void;
    errors: Partial<Record<keyof FormData, string>>;
    logoPreview: string | null;
    fileRef: React.RefObject<HTMLInputElement>;
    onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const handleNameChange = (val: string) => {
        setData('name', val);
        if (!data.slug || data.slug === slugify(data.name)) {
            setData('slug', slugify(val));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">School Identity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Official registration details and academic classification</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Logo + Name row */}
                <FieldRow span={2}>
                    <div className="flex items-start gap-5">
                        {/* Logo circle */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative shrink-0 h-20 w-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group overflow-hidden"
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <Upload className="h-5 w-5" />
                                    <span className="text-[10px] font-semibold">Logo</span>
                                </div>
                            )}
                            {logoPreview && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload className="h-5 w-5 text-white" />
                                </div>
                            )}
                        </div>
                        <input ref={fileRef} id="logo" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={onLogoChange} className="sr-only" />
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="name" required>Official School Name</Label>
                            <Input
                                id="name" value={data.name}
                                onChange={e => handleNameChange(e.target.value)}
                                placeholder="e.g. St. Augustine's Academy"
                                error={errors.name}
                            />
                            <p className="text-[11px] text-slate-400">Click the box on the left to upload a logo (PNG, JPG, SVG · max 3 MB)</p>
                        </div>
                    </div>
                </FieldRow>

                <div>
                    <Label htmlFor="short_name">Short Name / Abbreviation</Label>
                    <Input id="short_name" value={data.short_name} onChange={e => setData('short_name', e.target.value)} placeholder="e.g. SAA, SJCA" error={errors.short_name} />
                </div>

                <div>
                    <Label htmlFor="slug" required>Tenant Slug <span className="normal-case font-normal text-slate-400">(URL prefix)</span></Label>
                    <Input id="slug" value={data.slug} onChange={e => setData('slug', slugify(e.target.value))} placeholder="st-augustines-academy" className="font-mono text-xs" error={errors.slug} />
                </div>

                <FieldRow span={2}>
                    <Label htmlFor="motto">School Motto</Label>
                    <Input id="motto" value={data.motto} onChange={e => setData('motto', e.target.value)} placeholder="e.g. Excellence Through Knowledge" error={errors.motto} />
                </FieldRow>

                <div>
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input id="registration_number" value={data.registration_number} onChange={e => setData('registration_number', e.target.value)} placeholder="Official reg. number" error={errors.registration_number} />
                </div>

                <div>
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input id="year_established" type="number" value={data.year_established} onChange={e => setData('year_established', e.target.value)} placeholder="e.g. 1992" min={1800} max={new Date().getFullYear()} error={errors.year_established} />
                </div>

                <div>
                    <Label htmlFor="school_type">School Type</Label>
                    <Select id="school_type" value={data.school_type} onChange={e => setData('school_type', e.target.value)} placeholder="Select type…"
                        options={[
                            { value: 'ECCD', label: 'ECCD / Nursery' },
                            { value: 'Primary', label: 'Primary School' },
                            { value: 'Secondary', label: 'Secondary School' },
                            { value: 'Combined', label: 'Combined (Primary + Secondary)' },
                            { value: 'Technical', label: 'Technical / Vocational' },
                            { value: 'University', label: 'University / College' },
                            { value: 'Other', label: 'Other' },
                        ]} error={errors.school_type}
                    />
                </div>

                <div>
                    <Label htmlFor="ownership">Ownership / Sector</Label>
                    <Select id="ownership" value={data.ownership} onChange={e => setData('ownership', e.target.value)} placeholder="Select ownership…"
                        options={[
                            { value: 'Private', label: 'Private' },
                            { value: 'Government', label: 'Government / Public' },
                            { value: 'Mission', label: 'Mission / Faith-Based' },
                            { value: 'Community', label: 'Community' },
                            { value: 'NGO', label: 'NGO / Non-profit' },
                            { value: 'International', label: 'International' },
                            { value: 'Other', label: 'Other' },
                        ]} error={errors.ownership}
                    />
                </div>

                <FieldRow span={2}>
                    <Label htmlFor="education_level">Education Level / Curriculum</Label>
                    <Input id="education_level" value={data.education_level} onChange={e => setData('education_level', e.target.value)} placeholder="e.g. MSCE, LGCSE, IGCSE, National Curriculum" error={errors.education_level} />
                </FieldRow>
            </div>
        </div>
    );
}

function Step2Contact({
    data, setData, errors, gpsLoading, onFetchGPS,
}: {
    data: FormData;
    setData: (key: keyof FormData, val: any) => void;
    errors: Partial<Record<keyof FormData, string>>;
    gpsLoading: boolean;
    onFetchGPS: () => void;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact & Location</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Official communication channels and physical address</p>
            </div>

            {/* Contact */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Communication</p>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <Label htmlFor="email">Official Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="school@example.edu.mw" error={errors.email} />
                    </div>
                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" type="url" value={data.website} onChange={e => setData('website', e.target.value)} placeholder="https://school.ac.mw" error={errors.website} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Primary Phone</Label>
                        <Input id="phone" type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+265 1 234 567" error={errors.phone} />
                    </div>
                    <div>
                        <Label htmlFor="alt_phone">Alternative Phone</Label>
                        <Input id="alt_phone" type="tel" value={data.alt_phone} onChange={e => setData('alt_phone', e.target.value)} placeholder="+265 999 000 111" error={errors.alt_phone} />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Physical Address</p>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FieldRow span={2}>
                        <Label htmlFor="address">Street / Physical Address</Label>
                        <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Plot 24, Area 18, Robert Mugabe Crescent" error={errors.address} />
                    </FieldRow>
                    <FieldRow span={2}>
                        <Label htmlFor="postal_address">Postal Address</Label>
                        <Input id="postal_address" value={data.postal_address} onChange={e => setData('postal_address', e.target.value)} placeholder="P.O. Box 1024, Lilongwe" error={errors.postal_address} />
                    </FieldRow>
                    <div>
                        <Label htmlFor="city">City / Town</Label>
                        <Input id="city" value={data.city} onChange={e => setData('city', e.target.value)} placeholder="Lilongwe" error={errors.city} />
                    </div>
                    <div>
                        <Label htmlFor="district">District</Label>
                        <Input id="district" value={data.district} onChange={e => setData('district', e.target.value)} placeholder="Lilongwe District" error={errors.district} />
                    </div>
                    <div>
                        <Label htmlFor="region">Region</Label>
                        <Select id="region" value={data.region} onChange={e => setData('region', e.target.value)} placeholder="Select region…"
                            options={[
                                { value: 'Northern', label: 'Northern Region' },
                                { value: 'Central', label: 'Central Region' },
                                { value: 'Southern', label: 'Southern Region' },
                                { value: 'Eastern', label: 'Eastern Region' },
                                { value: 'Western', label: 'Western Region' },
                                { value: 'Other', label: 'Other' },
                            ]} error={errors.region}
                        />
                    </div>
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={data.country} onChange={e => setData('country', e.target.value)} placeholder="Malawi" error={errors.country} />
                    </div>
                </div>
            </div>

            {/* GPS */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60">
                            <Navigation className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </span>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">GPS Coordinates <span className="font-normal text-slate-400">(optional)</span></p>
                            <p className="text-[11px] text-slate-400">Pin the school location for maps and reports</p>
                        </div>
                    </div>
                    <button type="button" onClick={onFetchGPS} disabled={gpsLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                        <Navigation className="h-3 w-3" />
                        {gpsLoading ? 'Locating…' : 'Use my location'}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="gps_lat">Latitude</Label>
                        <Input id="gps_lat" type="number" step="0.0000001" value={data.gps_lat} onChange={e => setData('gps_lat', e.target.value)} placeholder="-13.9626" error={errors.gps_lat} />
                    </div>
                    <div>
                        <Label htmlFor="gps_lng">Longitude</Label>
                        <Input id="gps_lng" type="number" step="0.0000001" value={data.gps_lng} onChange={e => setData('gps_lng', e.target.value)} placeholder="33.7741" error={errors.gps_lng} />
                    </div>
                </div>
                {data.gps_lat && data.gps_lng && (
                    <a href={`https://www.google.com/maps?q=${data.gps_lat},${data.gps_lng}`} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                        <Globe className="h-3 w-3" />
                        View on Google Maps
                    </a>
                )}
            </div>
        </div>
    );
}

function Step3Leadership({
    data, setData, errors,
}: {
    data: FormData;
    setData: (key: keyof FormData, val: any) => void;
    errors: Partial<Record<keyof FormData, string>>;
}) {
    const roles: { key: keyof FormData; label: string; placeholder: string; hint?: string }[] = [
        { key: 'principal_name', label: 'Headteacher / Principal', placeholder: 'Full name', hint: 'Head of academic affairs' },
        { key: 'deputy_principal_name', label: 'Deputy Headteacher', placeholder: 'Full name', hint: 'Second-in-command' },
        { key: 'director_name', label: 'Director / Proprietor', placeholder: 'Full name', hint: 'Owner or board director' },
        { key: 'administrator_name', label: 'School Administrator', placeholder: 'Full name', hint: 'Operations & administration' },
        { key: 'bursar_name', label: 'Bursar / Finance Officer', placeholder: 'Full name', hint: 'Fee collection & finances' },
        { key: 'academic_director_name', label: 'Academic Director', placeholder: 'Full name', hint: 'Curriculum oversight' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">School Leadership</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">These will appear on official documents and reports. All fields are optional.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {roles.map((r, i) => (
                    <div key={r.key} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                        <div className="flex items-center gap-2.5 mb-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                {i + 1}
                            </span>
                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{r.label}</p>
                                {r.hint && <p className="text-[10px] text-slate-400 leading-tight">{r.hint}</p>}
                            </div>
                        </div>
                        <Input
                            id={r.key as string} value={data[r.key] as string}
                            onChange={e => setData(r.key, e.target.value)}
                            placeholder={r.placeholder}
                            error={errors[r.key]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step4System({
    data, setData, errors,
}: {
    data: FormData;
    setData: (key: keyof FormData, val: any) => void;
    errors: Partial<Record<keyof FormData, string>>;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">System & Branding</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Locale, timezone, currency and brand colours for the tenant</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" value={data.timezone} onChange={e => setData('timezone', e.target.value)} placeholder="Africa/Blantyre" error={errors.timezone} />
                </div>
                <div>
                    <Label htmlFor="locale">Language / Locale</Label>
                    <Select id="locale" value={data.locale} onChange={e => setData('locale', e.target.value)}
                        options={[
                            { value: 'en', label: 'English (en)' },
                            { value: 'ny', label: 'Chichewa (ny)' },
                            { value: 'fr', label: 'French (fr)' },
                            { value: 'sw', label: 'Swahili (sw)' },
                            { value: 'pt', label: 'Portuguese (pt)' },
                        ]} error={errors.locale}
                    />
                </div>
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select id="currency" value={data.currency} onChange={e => setData('currency', e.target.value)}
                        options={[
                            { value: 'MWK', label: 'MWK — Malawian Kwacha' },
                            { value: 'USD', label: 'USD — US Dollar' },
                            { value: 'ZMW', label: 'ZMW — Zambian Kwacha' },
                            { value: 'TZS', label: 'TZS — Tanzanian Shilling' },
                            { value: 'KES', label: 'KES — Kenyan Shilling' },
                            { value: 'ZAR', label: 'ZAR — South African Rand' },
                            { value: 'GBP', label: 'GBP — British Pound' },
                            { value: 'EUR', label: 'EUR — Euro' },
                        ]} error={errors.currency}
                    />
                </div>

                {/* Brand colours */}
                <div>
                    <Label htmlFor="primary_color">Primary Brand Colour</Label>
                    <div className="flex items-center gap-2">
                        <input id="primary_color" type="color" value={data.primary_color} onChange={e => setData('primary_color', e.target.value)}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5 dark:border-slate-700" />
                        <Input id="primary_color_text" value={data.primary_color} onChange={e => setData('primary_color', e.target.value)} className="font-mono flex-1 text-xs" />
                    </div>
                </div>

                <div>
                    <Label htmlFor="secondary_color">Secondary Brand Colour</Label>
                    <div className="flex items-center gap-2">
                        <input id="secondary_color" type="color" value={data.secondary_color} onChange={e => setData('secondary_color', e.target.value)}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5 dark:border-slate-700" />
                        <Input id="secondary_color_text" value={data.secondary_color} onChange={e => setData('secondary_color', e.target.value)} className="font-mono flex-1 text-xs" />
                    </div>
                </div>
            </div>

            {/* Activation toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Activate immediately</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">The school tenant will be live as soon as it's created</p>
                </div>
                <button
                    type="button"
                    onClick={() => setData('is_active', !data.is_active)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        data.is_active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                    role="switch" aria-checked={data.is_active}
                >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        data.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                </button>
            </div>

            {/* Summary preview */}
            <ReviewSummary data={data} />
        </div>
    );
}

// ─── Review summary card shown on step 4 ──────────────────────────────────────

function ReviewSummary({ data }: { data: FormData }) {
    const rows: { label: string; value: string | null | undefined }[] = [
        { label: 'Name', value: data.name },
        { label: 'Type', value: data.school_type || null },
        { label: 'Ownership', value: data.ownership || null },
        { label: 'Email', value: data.email || null },
        { label: 'Phone', value: data.phone || null },
        { label: 'Location', value: [data.city, data.district, data.country].filter(Boolean).join(', ') || null },
        { label: 'Principal', value: data.principal_name || null },
        { label: 'Timezone', value: data.timezone },
        { label: 'Currency', value: data.currency },
    ].filter(r => r.value);

    if (!data.name) return null;

    return (
        <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Review Summary</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                {rows.map(r => (
                    <div key={r.label}>
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{r.label}</dt>
                        <dd className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{r.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CreateSchool() {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null!);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '', short_name: '', slug: '', motto: '', registration_number: '',
        school_type: '', ownership: '', year_established: '', education_level: '',
        logo: null,
        email: '', phone: '', alt_phone: '', website: '',
        address: '', postal_address: '', city: '', district: '', region: '', country: 'Malawi',
        gps_lat: '', gps_lng: '',
        principal_name: '', deputy_principal_name: '', director_name: '',
        administrator_name: '', bursar_name: '', academic_director_name: '',
        timezone: 'Africa/Blantyre', locale: 'en',
        primary_color: '#2563eb', secondary_color: '#0f172a',
        currency: 'MWK', is_active: true,
    });

    const typedSetData = (key: keyof FormData, val: any) => setData(key as any, val);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        typedSetData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const fetchGPS = () => {
        if (!navigator.geolocation) return;
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                typedSetData('gps_lat', pos.coords.latitude.toFixed(7));
                typedSetData('gps_lng', pos.coords.longitude.toFixed(7));
                setGpsLoading(false);
            },
            () => setGpsLoading(false),
        );
    };

    // Step-level validation (client-side) before advancing
    const validateStep = (): boolean => {
        if (step === 1 && !data.name.trim()) {
            return false; // rely on server validation on submit; just block advance
        }
        return true;
    };

    const next = () => { if (validateStep() && step < 4) setStep(s => s + 1); };
    const prev = () => { if (step > 1) setStep(s => s - 1); };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('schools.store'), { forceFormData: true });
    };

    const breadcrumbs = [
        { label: 'Superadmin', href: '/schools' },
        { label: 'Schools & Tenants', href: route('schools.index') },
        { label: 'Provision New School' },
    ];

    // Step 1 required: name must be non-empty to advance
    const canAdvance = step < 4 && (step !== 1 || data.name.trim().length > 0);

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Provision New School" />

            <div className="school-app">
                {/* ── Page header ───────────────────────────────────────── */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-none">
                            SUPERADMIN / MULTI-TENANCY
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Provision New School
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Complete the institutional profile across {STEPS.length} steps
                        </p>
                    </div>
                    <Link
                        href={route('schools.index')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 shrink-0"
                    >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                    </Link>
                </div>

                {/* ── Main card ─────────────────────────────────────────── */}
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

                        {/* Step indicator bar */}
                        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-8 pt-7 pb-6">
                            <StepIndicator current={step} total={STEPS.length} />
                        </div>

                        {/* Form body */}
                        <form onSubmit={submit}>
                            <div className="px-8 py-7 min-h-[420px]">
                                {step === 1 && (
                                    <Step1Identity
                                        data={data} setData={typedSetData} errors={errors}
                                        logoPreview={logoPreview} fileRef={fileRef} onLogoChange={handleLogoChange}
                                    />
                                )}
                                {step === 2 && (
                                    <Step2Contact
                                        data={data} setData={typedSetData} errors={errors}
                                        gpsLoading={gpsLoading} onFetchGPS={fetchGPS}
                                    />
                                )}
                                {step === 3 && (
                                    <Step3Leadership data={data} setData={typedSetData} errors={errors} />
                                )}
                                {step === 4 && (
                                    <Step4System data={data} setData={typedSetData} errors={errors} />
                                )}
                            </div>

                            {/* Footer nav */}
                            <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-8 py-4 flex items-center justify-between gap-4">
                                {/* Back */}
                                <button
                                    type="button" onClick={prev} disabled={step === 1}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Back
                                </button>

                                {/* Step count */}
                                <span className="text-xs font-semibold text-slate-400">
                                    Step {step} of {STEPS.length}
                                </span>

                                {/* Next / Submit */}
                                {step < 4 ? (
                                    <button
                                        type="button" onClick={next} disabled={!canAdvance}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit" disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-all"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Creating school…
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Provision School
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Help text */}
                    <p className="mt-4 text-center text-[11px] text-slate-400">
                        Fields marked <span className="text-rose-500 font-bold">*</span> are required. All others can be completed later from the school profile.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 100);
}
