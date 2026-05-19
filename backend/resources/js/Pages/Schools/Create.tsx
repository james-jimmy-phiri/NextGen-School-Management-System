import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateSchool() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        timezone: 'UTC',
        locale: 'en',
        address: '',
        phone: '',
        email: '',
        website: '',
        city: '',
        country: '',
        postal_address: '',
        primary_color: '#0f172a',
        secondary_color: '#3b82f6',
        currency: 'USD',
        is_active: true,
        logo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('schools.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href={route('schools.index')} className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900">
                            &larr; Back to Schools
                        </Link>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Provision New School
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Create School" />

            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <form onSubmit={submit} className="p-8 space-y-8">
                    {/* Basic Info Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">School Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Tenant Slug (URL prefix) *</label>
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm font-mono text-xs"
                                    required
                                />
                                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
                            </div>

                            <div>
                                <label htmlFor="timezone" className="block text-sm font-medium text-slate-700">Timezone</label>
                                <input
                                    id="timezone"
                                    type="text"
                                    value={data.timezone}
                                    onChange={(e) => setData('timezone', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                    placeholder="e.g., Africa/Blantyre"
                                />
                                {errors.timezone && <p className="mt-1 text-sm text-red-500">{errors.timezone}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="locale" className="block text-sm font-medium text-slate-700">Locale</label>
                                <input
                                    id="locale"
                                    type="text"
                                    value={data.locale}
                                    onChange={(e) => setData('locale', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                    placeholder="e.g., en"
                                />
                                {errors.locale && <p className="mt-1 text-sm text-red-500">{errors.locale}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Admin Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="website" className="block text-sm font-medium text-slate-700">Website URL</label>
                                <input
                                    id="website"
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Physical Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                                <input
                                    id="country"
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                />
                                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Branding Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Branding & Finance</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div className="sm:col-span-3">
                                <label htmlFor="logo" className="block text-sm font-medium text-slate-700">School Logo</label>
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                    className="mt-1 block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-slate-50 file:text-slate-700
                                        hover:file:bg-slate-100
                                    "
                                />
                                {errors.logo && <p className="mt-1 text-sm text-red-500">{errors.logo}</p>}
                            </div>

                            <div>
                                <label htmlFor="primary_color" className="block text-sm font-medium text-slate-700">Primary Color</label>
                                <input
                                    id="primary_color"
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(e) => setData('primary_color', e.target.value)}
                                    className="mt-1 block h-10 w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm cursor-pointer"
                                />
                                {errors.primary_color && <p className="mt-1 text-sm text-red-500">{errors.primary_color}</p>}
                            </div>

                            <div>
                                <label htmlFor="secondary_color" className="block text-sm font-medium text-slate-700">Secondary Color</label>
                                <input
                                    id="secondary_color"
                                    type="color"
                                    value={data.secondary_color}
                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                    className="mt-1 block h-10 w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm cursor-pointer"
                                />
                                {errors.secondary_color && <p className="mt-1 text-sm text-red-500">{errors.secondary_color}</p>}
                            </div>

                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-slate-700">Currency</label>
                                <input
                                    id="currency"
                                    type="text"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                                    placeholder="e.g., MWK"
                                />
                                {errors.currency && <p className="mt-1 text-sm text-red-500">{errors.currency}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                        <label className="flex items-center gap-2 mr-auto cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-slate-900 shadow-sm focus:ring-slate-900"
                            />
                            <span className="text-sm font-medium text-slate-700">Tenant is active</span>
                        </label>
                        
                        <Link
                            href={route('schools.index')}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create School'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
