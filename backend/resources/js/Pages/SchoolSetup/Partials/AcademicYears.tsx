import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AcademicYear {
    id: number;
    title: string;
    starts_on: string;
    ends_on: string;
    is_current: boolean;
    status: string;
}

export default function AcademicYears({ years }: { years: AcademicYear[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        starts_on: '',
        ends_on: '',
        is_current: false,
        status: 'active',
    });

    const openCreateForm = () => {
        reset();
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (year: AcademicYear) => {
        setData({
            title: year.title,
            starts_on: year.starts_on.split('T')[0],
            ends_on: year.ends_on.split('T')[0],
            is_current: year.is_current,
            status: year.status,
        });
        setEditingId(year.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        reset();
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            patch(route('school-setup.academic-years.update', editingId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Academic year updated');
                    closeForm();
                },
            });
        } else {
            post(route('school-setup.academic-years.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Academic year created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this academic year?')) {
            destroy(route('school-setup.academic-years.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Academic year deleted'),
            });
        }
    };

    const handleSetCurrent = (year: AcademicYear) => {
        router.patch(route('school-setup.academic-years.update', year.id), {
            ...year,
            is_current: true,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${year.title} set as current year`),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Academic Years</h3>
                    <p className="text-sm text-slate-500">Manage the school's academic calendars and active years.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New Year
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Academic Year' : 'Create Academic Year'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g., 2026-2027" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Status</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Start Date</label>
                                <input type="date" value={data.starts_on} onChange={e => setData('starts_on', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.starts_on && <p className="text-red-500 text-xs mt-1">{errors.starts_on}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">End Date</label>
                                <input type="date" value={data.ends_on} onChange={e => setData('ends_on', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.ends_on && <p className="text-red-500 text-xs mt-1">{errors.ends_on}</p>}
                            </div>
                            <div className="md:col-span-2 flex items-center mt-2">
                                <input type="checkbox" id="is_current" checked={data.is_current} onChange={e => setData('is_current', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                                <label htmlFor="is_current" className="ml-2 text-sm text-slate-700 font-medium">Set as Current Academic Year</label>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Year'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Start Date</th>
                                <th className="px-6 py-3">End Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!years || years.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No academic years configured.</td>
                                </tr>
                            ) : (
                                years.map((year) => (
                                    <tr key={year.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {year.title}
                                            {year.is_current && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">Current</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{new Date(year.starts_on).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-600">{new Date(year.ends_on).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${year.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                                                {year.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {!year.is_current && (
                                                    <button onClick={() => handleSetCurrent(year)} title="Set as Current" className="text-slate-400 hover:text-emerald-600 transition-colors"><Check className="w-4 h-4" /></button>
                                                )}
                                                <button onClick={() => openEditForm(year)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(year.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
