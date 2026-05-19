import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Department {
    id: number;
    name: string;
    type: string;
    description: string;
    head_of_department_id: number | null;
    head_of_department: { name: string } | null;
}

interface Teacher {
    id: number;
    name: string;
}

export default function Departments({ departments, teachersList }: { departments: Department[], teachersList: Teacher[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        type: 'academic',
        description: '',
        head_of_department_id: '',
    });

    const openCreateForm = () => {
        reset();
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (dept: Department) => {
        setData({
            name: dept.name,
            type: dept.type,
            description: dept.description || '',
            head_of_department_id: dept.head_of_department_id?.toString() || '',
        });
        setEditingId(dept.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        reset();
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const currentData = { ...data, head_of_department_id: data.head_of_department_id || null };

        if (editingId) {
            router.patch(route('school-setup.departments.update', editingId), currentData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Department updated');
                    closeForm();
                },
            });
        } else {
            router.post(route('school-setup.departments.store'), currentData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Department created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            destroy(route('school-setup.departments.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Department deleted'),
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Departments</h3>
                    <p className="text-sm text-slate-500">Manage academic and administrative departments.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New Department
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Department' : 'Create Department'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Department Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., Science" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="academic">Academic</option>
                                    <option value="administrative">Administrative</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Head of Department (Optional)</label>
                                <select value={data.head_of_department_id} onChange={e => setData('head_of_department_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="">Select Head of Department</option>
                                    {teachersList?.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Description (Optional)</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Department'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(!departments || departments.length === 0) ? (
                        <div className="col-span-full py-12 text-center text-slate-500 border border-slate-200 rounded-2xl bg-slate-50">
                            No departments configured.
                        </div>
                    ) : (
                        departments.map((dept) => (
                            <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 transition-colors group relative">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${dept.type === 'academic' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {dept.type}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditForm(dept)} className="text-slate-400 hover:text-indigo-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(dept.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h4>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{dept.description || 'No description provided.'}</p>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Head of Department</p>
                                    <p className="text-sm font-bold text-slate-700">{dept.head_of_department?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
