import React from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

interface SchoolProfileProps {
    initialData: any;
}

export default function SchoolProfile({ initialData }: SchoolProfileProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: initialData?.name || '',
        motto: initialData?.branding?.motto || '',
        address: initialData?.address || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        website: initialData?.website || '',
        city: initialData?.city || '',
        country: initialData?.country || '',
        primary_color: initialData?.primary_color || '#4f46e5',
        currency: initialData?.currency || 'USD',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as any, e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('school-setup.school.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('School profile updated successfully'),
            onError: () => toast.error('Failed to update school profile'),
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900">School Profile</h3>
                <p className="text-sm text-slate-500">Update your institution's core details and branding.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">School Name</label>
                        <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Motto</label>
                        <input type="text" name="motto" value={data.motto} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                        {errors.motto && <p className="text-red-500 text-xs mt-1">{errors.motto}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                        <input type="email" name="email" value={data.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                        <input type="text" name="phone" value={data.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Website</label>
                        <input type="url" name="website" value={data.website} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Currency</label>
                        <input type="text" name="currency" value={data.currency} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Address</label>
                        <input type="text" name="address" value={data.address} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">City</label>
                        <input type="text" name="city" value={data.city} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Country</label>
                        <input type="text" name="country" value={data.country} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" name="primary_color" value={data.primary_color} onChange={handleChange} className="h-10 w-10 border-0 rounded-xl cursor-pointer" />
                            <span className="text-sm font-medium text-slate-600">{data.primary_color}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm shadow-indigo-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
