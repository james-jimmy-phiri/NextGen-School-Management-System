import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subject {
    id: number;
    code: string;
    name: string;
    department_id: number | null;
    type: string;
    gpa_weight: number;
    pass_mark: number;
    teacher_id: number | null;
    department: { name: string } | null;
    teacher: { name: string } | null;
}

interface Opt {
    id: number;
    name: string;
}

export default function Subjects({ subjects, departmentsList, teachersList }: { subjects: Subject[], departmentsList: Opt[], teachersList: Opt[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        code: '',
        name: '',
        department_id: '',
        type: 'compulsory',
        gpa_weight: '1.0',
        pass_mark: '50',
        teacher_id: '',
    });

    const openCreateForm = () => {
        reset();
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (subject: Subject) => {
        setData({
            code: subject.code,
            name: subject.name,
            department_id: subject.department_id?.toString() || '',
            type: subject.type,
            gpa_weight: subject.gpa_weight?.toString() || '1.0',
            pass_mark: subject.pass_mark?.toString() || '50',
            teacher_id: subject.teacher_id?.toString() || '',
        });
        setEditingId(subject.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        reset();
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = {
            ...data,
            department_id: data.department_id || null,
            teacher_id: data.teacher_id || null,
        };

        if (editingId) {
            router.patch(route('school-setup.subjects.update', editingId), submitData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Subject updated');
                    closeForm();
                },
            });
        } else {
            router.post(route('school-setup.subjects.store'), submitData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Subject created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this subject?')) {
            destroy(route('school-setup.subjects.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Subject deleted'),
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Subjects</h3>
                    <p className="text-sm text-slate-500">Manage school subjects, pass marks, and GPA weights.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New Subject
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Subject' : 'Create Subject'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Subject Code</label>
                                <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} placeholder="e.g., MAT101" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Subject Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., Mathematics" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Department (Optional)</label>
                                <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="">Select Department</option>
                                    {departmentsList?.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="compulsory">Compulsory</option>
                                    <option value="elective">Elective</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">GPA Weight</label>
                                <input type="number" step="0.1" value={data.gpa_weight} onChange={e => setData('gpa_weight', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Pass Mark</label>
                                <input type="number" step="0.1" value={data.pass_mark} onChange={e => setData('pass_mark', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Subject Coordinator / Head Teacher (Optional)</label>
                                <select value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="">Select Teacher</option>
                                    {teachersList?.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Subject'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Subject Name</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Pass / GPA</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!subjects || subjects.length === 0) ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No subjects configured.</td>
                                </tr>
                            ) : (
                                subjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-500">{subject.code}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{subject.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{subject.department?.name || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600 capitalize">{subject.type}</td>
                                        <td className="px-6 py-4 text-slate-600">{subject.pass_mark}% / {subject.gpa_weight}x</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditForm(subject)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(subject.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
