import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Term {
    id: number;
    name: string;
    academic_year_id: number;
    position: number;
    starts_on: string | null;
    ends_on: string | null;
    is_active: boolean;
    academic_year: { title: string };
}

interface AcademicYearOpt {
    id: number;
    title: string;
    is_current: boolean;
}

export default function Terms({ terms, academicYearsList }: { terms: Term[], academicYearsList: AcademicYearOpt[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const defaultYearId = academicYearsList?.find(y => y.is_current)?.id || (academicYearsList?.length > 0 ? academicYearsList[0].id : '');

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        academic_year_id: defaultYearId,
        position: 1,
        starts_on: '',
        ends_on: '',
        is_active: true,
    });

    const openCreateForm = () => {
        reset();
        setData('academic_year_id', defaultYearId);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (term: Term) => {
        setData({
            name: term.name,
            academic_year_id: term.academic_year_id,
            position: term.position,
            starts_on: term.starts_on ? term.starts_on.split('T')[0] : '',
            ends_on: term.ends_on ? term.ends_on.split('T')[0] : '',
            is_active: term.is_active,
        });
        setEditingId(term.id);
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
            patch(route('school-setup.terms.update', editingId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Term updated');
                    closeForm();
                },
            });
        } else {
            post(route('school-setup.terms.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Term created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this term?')) {
            destroy(route('school-setup.terms.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Term deleted'),
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Terms / Semesters</h3>
                    <p className="text-sm text-slate-500">Manage academic terms or semesters within years.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New Term
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Term' : 'Create Term'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Academic Year</label>
                                <select value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                    <option value="" disabled>Select Academic Year</option>
                                    {academicYearsList?.map(y => (
                                        <option key={y.id} value={y.id}>{y.title}</option>
                                    ))}
                                </select>
                                {errors.academic_year_id && <p className="text-red-500 text-xs mt-1">{errors.academic_year_id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Term Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., Term 1" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Position (Order)</label>
                                <input type="number" min="1" value={data.position} onChange={e => setData('position', parseInt(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Status</label>
                                <select value={data.is_active ? '1' : '0'} onChange={e => setData('is_active', e.target.value === '1')} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Start Date (Optional)</label>
                                <input type="date" value={data.starts_on} onChange={e => setData('starts_on', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                                {errors.starts_on && <p className="text-red-500 text-xs mt-1">{errors.starts_on}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">End Date (Optional)</label>
                                <input type="date" value={data.ends_on} onChange={e => setData('ends_on', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                                {errors.ends_on && <p className="text-red-500 text-xs mt-1">{errors.ends_on}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Term'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Term Name</th>
                                <th className="px-6 py-3">Academic Year</th>
                                <th className="px-6 py-3">Dates</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!terms || terms.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No terms configured.</td>
                                </tr>
                            ) : (
                                terms.map((term) => (
                                    <tr key={term.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{term.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{term.academic_year?.title}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {term.starts_on ? new Date(term.starts_on).toLocaleDateString() : '—'} - {term.ends_on ? new Date(term.ends_on).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {term.is_active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">Active</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditForm(term)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(term.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
