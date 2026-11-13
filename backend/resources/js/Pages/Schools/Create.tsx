import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
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
} from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

// ─── Reusable Field Components ───────────────────────────────────────────────

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
    return (
        <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 leading-none">
            {children}
            {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
    );
}

function FieldInput({
    id, type = 'text', value, onChange, placeholder, error, className = '', ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
    return (
        <>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-border dark:bg-card dark:text-white transition-colors ${className}`}
                {...rest}
            />
            {error && <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>}
        </>
    );
}

function FieldSelect({
    id, value, onChange, options, placeholder, error, className = ''
}: {
    id: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
    className?: string;
}) {
    return (
        <>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-border dark:bg-card dark:text-white transition-colors ${className}`}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>}
        </>
    );
}

function SectionCard({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-border dark:bg-card shadow-2xs overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-border bg-slate-50/60 dark:bg-muted/40 px-5 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60">
                    <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </span>
                <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                    {description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            <div className="p-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function CreateSchool() {
    const { data, setData, post, processing, errors, reset } = useForm({
        // Identity
        name: '',
        short_name: '',
        slug: '',
        motto: '',
        registration_number: '',
        school_type: '',
        ownership: '',
        year_established: '',
        education_level: '',
        logo: null as File | null,

        // Branding / System
        timezone: 'Africa/Blantyre',
        locale: 'en',
        primary_color: '#2563eb',
        secondary_color: '#0f172a',
        currency: 'MWK',
        is_active: true,

        // Contact
        email: '',
        phone: '',
        alt_phone: '',
        website: '',

        // Address
        address: '',
        postal_address: '',
        city: '',
        district: '',
        region: '',
        country: 'Malawi',

        // GPS
        gps_lat: '',
        gps_lng: '',

        // Leadership
        principal_name: '',
        deputy_principal_name: '',
        director_name: '',
        administrator_name: '',
        bursar_name: '',
        academic_director_name: '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [gpsLoading, setGpsLoading] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('schools.store'), { forceFormData: true });
    };

    // Auto-generate slug from name
    const handleNameChange = (val: string) => {
        setData('name', val);
        if (!data.slug || data.slug === slugify(data.name)) {
            setData('slug', slugify(val));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
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
            (pos) => {
                setData((prev) => ({
                    ...prev,
                    gps_lat: pos.coords.latitude.toFixed(7),
                    gps_lng: pos.coords.longitude.toFixed(7),
                }));
                setGpsLoading(false);
            },
            () => setGpsLoading(false),
        );
    };

    const breadcrumbs = [
        { label: 'Superadmin', href: '/schools' },
        { label: 'Schools & Tenants', href: route('schools.index') },
        { label: 'Provision New School' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Provision New School" />

            <div className="school-app max-w-[860px] mx-auto pb-10">
                {/* ── Page Title ──────────────────────────────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-none">
                            SUPERADMIN / MULTI-TENANCY
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Provision New School
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Complete the institutional profile for the new school tenant
                        </p>
                    </div>
                    <Link
                        href={route('schools.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted"
                    >
                        Cancel
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* ── 1. School Identity ──────────────────────────────── */}
                    <SectionCard icon={School} title="School Identity" description="Official names, registration and academic classification">
                        {/* School Name - full width */}
                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="name" required>Official School Name</FieldLabel>
                            <FieldInput
                                id="name"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g. St. Augustine's Academy"
                                error={errors.name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="short_name">Short Name / Abbreviation</FieldLabel>
                            <FieldInput
                                id="short_name"
                                value={data.short_name}
                                onChange={(e) => setData('short_name', e.target.value)}
                                placeholder="e.g. SAA, SJCA"
                                error={errors.short_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="slug" required>
                                Tenant Slug <span className="font-normal text-slate-400">(URL prefix)</span>
                            </FieldLabel>
                            <FieldInput
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', slugify(e.target.value))}
                                placeholder="e.g. st-augustines-academy"
                                className="font-mono"
                                error={errors.slug}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="motto">School Motto</FieldLabel>
                            <FieldInput
                                id="motto"
                                value={data.motto}
                                onChange={(e) => setData('motto', e.target.value)}
                                placeholder="e.g. Excellence Through Knowledge"
                                error={errors.motto}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="registration_number">Registration Number</FieldLabel>
                            <FieldInput
                                id="registration_number"
                                value={data.registration_number}
                                onChange={(e) => setData('registration_number', e.target.value)}
                                placeholder="Official reg. number"
                                error={errors.registration_number}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="year_established">Year Established</FieldLabel>
                            <FieldInput
                                id="year_established"
                                type="number"
                                value={data.year_established}
                                onChange={(e) => setData('year_established', e.target.value)}
                                placeholder="e.g. 1992"
                                min={1800}
                                max={new Date().getFullYear()}
                                error={errors.year_established}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="school_type">School Type</FieldLabel>
                            <FieldSelect
                                id="school_type"
                                value={data.school_type}
                                onChange={(e) => setData('school_type', e.target.value)}
                                placeholder="Select type..."
                                options={[
                                    { value: 'ECCD', label: 'ECCD / Nursery' },
                                    { value: 'Primary', label: 'Primary School' },
                                    { value: 'Secondary', label: 'Secondary School' },
                                    { value: 'Combined', label: 'Combined (Primary + Secondary)' },
                                    { value: 'Technical', label: 'Technical / Vocational' },
                                    { value: 'University', label: 'University / College' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                error={errors.school_type}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="ownership">Ownership / Sector</FieldLabel>
                            <FieldSelect
                                id="ownership"
                                value={data.ownership}
                                onChange={(e) => setData('ownership', e.target.value)}
                                placeholder="Select ownership..."
                                options={[
                                    { value: 'Private', label: 'Private' },
                                    { value: 'Government', label: 'Government / Public' },
                                    { value: 'Mission', label: 'Mission / Faith-Based' },
                                    { value: 'Community', label: 'Community' },
                                    { value: 'NGO', label: 'NGO / Non-profit' },
                                    { value: 'International', label: 'International' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                error={errors.ownership}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="education_level">Education Level</FieldLabel>
                            <FieldInput
                                id="education_level"
                                value={data.education_level}
                                onChange={(e) => setData('education_level', e.target.value)}
                                placeholder="e.g. MSCE, LGCSE, IGCSE"
                                error={errors.education_level}
                            />
                        </div>

                        {/* Logo upload - full width */}
                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="logo">School Logo</FieldLabel>
                            <div className="flex items-center gap-4">
                                {/* Logo preview circle */}
                                <div
                                    className="h-16 w-16 shrink-0 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors dark:border-border dark:bg-muted"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
                                    ) : (
                                        <School className="h-7 w-7 text-slate-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        ref={fileRef}
                                        id="logo"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                        onChange={handleLogoChange}
                                        className="sr-only"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted"
                                    >
                                        <Upload className="h-3.5 w-3.5" />
                                        {logoPreview ? 'Change logo' : 'Upload logo'}
                                    </button>
                                    <p className="mt-1.5 text-[11px] text-slate-400">
                                        PNG, JPG, WEBP or SVG · Max 3 MB · Recommended 400×400 px
                                    </p>
                                    {errors.logo && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.logo}</p>}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ── 2. Contact Information ──────────────────────────── */}
                    <SectionCard icon={Phone} title="Contact Information" description="Official communication channels and digital presence">
                        <div>
                            <FieldLabel htmlFor="email">Official Email Address</FieldLabel>
                            <FieldInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="school@example.edu.mw"
                                error={errors.email}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="phone">Primary Phone Number</FieldLabel>
                            <FieldInput
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+265 1 234 567"
                                error={errors.phone}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="alt_phone">Alternative Phone Number</FieldLabel>
                            <FieldInput
                                id="alt_phone"
                                type="tel"
                                value={data.alt_phone}
                                onChange={(e) => setData('alt_phone', e.target.value)}
                                placeholder="+265 999 000 111"
                                error={errors.alt_phone}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="website">Website</FieldLabel>
                            <FieldInput
                                id="website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://school.ac.mw"
                                error={errors.website}
                            />
                        </div>
                    </SectionCard>

                    {/* ── 3. Address & Location ───────────────────────────── */}
                    <SectionCard icon={MapPin} title="Physical Address" description="School location and postal details">
                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="address">Physical / Street Address</FieldLabel>
                            <FieldInput
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Plot 24, Area 18, Robert Mugabe Crescent"
                                error={errors.address}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="postal_address">Postal Address</FieldLabel>
                            <FieldInput
                                id="postal_address"
                                value={data.postal_address}
                                onChange={(e) => setData('postal_address', e.target.value)}
                                placeholder="P.O. Box 1024, Lilongwe"
                                error={errors.postal_address}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="city">City / Town</FieldLabel>
                            <FieldInput
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Lilongwe"
                                error={errors.city}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="district">District</FieldLabel>
                            <FieldInput
                                id="district"
                                value={data.district}
                                onChange={(e) => setData('district', e.target.value)}
                                placeholder="Lilongwe District"
                                error={errors.district}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="region">Region</FieldLabel>
                            <FieldSelect
                                id="region"
                                value={data.region}
                                onChange={(e) => setData('region', e.target.value)}
                                placeholder="Select region..."
                                options={[
                                    { value: 'Northern', label: 'Northern Region' },
                                    { value: 'Central', label: 'Central Region' },
                                    { value: 'Southern', label: 'Southern Region' },
                                    { value: 'Eastern', label: 'Eastern Region' },
                                    { value: 'Western', label: 'Western Region' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                error={errors.region}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="country">Country</FieldLabel>
                            <FieldInput
                                id="country"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                placeholder="Malawi"
                                error={errors.country}
                            />
                        </div>

                        {/* GPS Coordinates */}
                        <div className="sm:col-span-2 rounded-lg border border-slate-100 bg-slate-50/60 dark:border-border dark:bg-muted/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-3.5 w-3.5 text-blue-600" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">GPS Coordinates</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchGPS}
                                    disabled={gpsLoading}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all"
                                >
                                    <Navigation className="h-3 w-3" />
                                    {gpsLoading ? 'Locating...' : 'Use my location'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel htmlFor="gps_lat">Latitude</FieldLabel>
                                    <FieldInput
                                        id="gps_lat"
                                        type="number"
                                        step="0.0000001"
                                        value={data.gps_lat}
                                        onChange={(e) => setData('gps_lat', e.target.value)}
                                        placeholder="-13.9626"
                                        error={errors.gps_lat}
                                    />
                                </div>
                                <div>
                                    <FieldLabel htmlFor="gps_lng">Longitude</FieldLabel>
                                    <FieldInput
                                        id="gps_lng"
                                        type="number"
                                        step="0.0000001"
                                        value={data.gps_lng}
                                        onChange={(e) => setData('gps_lng', e.target.value)}
                                        placeholder="33.7741"
                                        error={errors.gps_lng}
                                    />
                                </div>
                            </div>
                            {data.gps_lat && data.gps_lng && (
                                <a
                                    href={`https://www.google.com/maps?q=${data.gps_lat},${data.gps_lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
                                >
                                    <Globe className="h-3 w-3" />
                                    View on Google Maps
                                </a>
                            )}
                        </div>
                    </SectionCard>

                    {/* ── 4. School Leadership ────────────────────────────── */}
                    <SectionCard icon={Users} title="School Leadership" description="Key personnel and their roles">
                        <div>
                            <FieldLabel htmlFor="principal_name">Headteacher / Principal's Name</FieldLabel>
                            <FieldInput
                                id="principal_name"
                                value={data.principal_name}
                                onChange={(e) => setData('principal_name', e.target.value)}
                                placeholder="Mr / Mrs Full Name"
                                error={errors.principal_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="deputy_principal_name">Deputy Headteacher's Name</FieldLabel>
                            <FieldInput
                                id="deputy_principal_name"
                                value={data.deputy_principal_name}
                                onChange={(e) => setData('deputy_principal_name', e.target.value)}
                                placeholder="Mr / Mrs Full Name"
                                error={errors.deputy_principal_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="director_name">Director / Proprietor's Name</FieldLabel>
                            <FieldInput
                                id="director_name"
                                value={data.director_name}
                                onChange={(e) => setData('director_name', e.target.value)}
                                placeholder="Full Name"
                                error={errors.director_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="administrator_name">School Administrator</FieldLabel>
                            <FieldInput
                                id="administrator_name"
                                value={data.administrator_name}
                                onChange={(e) => setData('administrator_name', e.target.value)}
                                placeholder="Full Name"
                                error={errors.administrator_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="bursar_name">Bursar / Finance Officer</FieldLabel>
                            <FieldInput
                                id="bursar_name"
                                value={data.bursar_name}
                                onChange={(e) => setData('bursar_name', e.target.value)}
                                placeholder="Full Name"
                                error={errors.bursar_name}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="academic_director_name">Academic Director</FieldLabel>
                            <FieldInput
                                id="academic_director_name"
                                value={data.academic_director_name}
                                onChange={(e) => setData('academic_director_name', e.target.value)}
                                placeholder="Full Name"
                                error={errors.academic_director_name}
                            />
                        </div>
                    </SectionCard>

                    {/* ── 5. System & Branding ────────────────────────────── */}
                    <SectionCard icon={Shield} title="System & Branding" description="Tenant configuration, colors, currency and academic calendar timezone">
                        <div>
                            <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                            <FieldInput
                                id="timezone"
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                                placeholder="Africa/Blantyre"
                                error={errors.timezone}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="locale">Locale / Language</FieldLabel>
                            <FieldSelect
                                id="locale"
                                value={data.locale}
                                onChange={(e) => setData('locale', e.target.value)}
                                options={[
                                    { value: 'en', label: 'English (en)' },
                                    { value: 'ny', label: 'Chichewa (ny)' },
                                    { value: 'fr', label: 'French (fr)' },
                                    { value: 'sw', label: 'Swahili (sw)' },
                                    { value: 'pt', label: 'Portuguese (pt)' },
                                ]}
                                error={errors.locale}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="currency">Currency Code</FieldLabel>
                            <FieldSelect
                                id="currency"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                options={[
                                    { value: 'MWK', label: 'MWK — Malawian Kwacha' },
                                    { value: 'USD', label: 'USD — US Dollar' },
                                    { value: 'ZMW', label: 'ZMW — Zambian Kwacha' },
                                    { value: 'TZS', label: 'TZS — Tanzanian Shilling' },
                                    { value: 'KES', label: 'KES — Kenyan Shilling' },
                                    { value: 'ZAR', label: 'ZAR — South African Rand' },
                                    { value: 'GBP', label: 'GBP — British Pound' },
                                    { value: 'EUR', label: 'EUR — Euro' },
                                ]}
                                error={errors.currency}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="primary_color">Brand Primary Color</FieldLabel>
                            <div className="flex items-center gap-2">
                                <input
                                    id="primary_color"
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(e) => setData('primary_color', e.target.value)}
                                    className="h-9 w-16 cursor-pointer rounded-lg border border-slate-200 p-0.5 dark:border-border"
                                />
                                <FieldInput
                                    id="primary_color_text"
                                    value={data.primary_color}
                                    onChange={(e) => setData('primary_color', e.target.value)}
                                    className="font-mono flex-1"
                                />
                            </div>
                        </div>

                        <div>
                            <FieldLabel htmlFor="secondary_color">Brand Secondary Color</FieldLabel>
                            <div className="flex items-center gap-2">
                                <input
                                    id="secondary_color"
                                    type="color"
                                    value={data.secondary_color}
                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                    className="h-9 w-16 cursor-pointer rounded-lg border border-slate-200 p-0.5 dark:border-border"
                                />
                                <FieldInput
                                    id="secondary_color_text"
                                    value={data.secondary_color}
                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                    className="font-mono flex-1"
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* ── Submit Bar ───────────────────────────────────────── */}
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white dark:border-border dark:bg-card shadow-2xs px-5 py-4">
                        <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-border"
                            />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Activate tenant immediately</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route('schools.index')}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-all"
                            >
                                {processing ? (
                                    <>
                                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <School className="h-3.5 w-3.5" />
                                        Provision School
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 100);
}
