import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface GradeLevel {
    id: number;
    code: string;
    label: string;
    sort_order: number;
}

interface ClassGroup {
    id: number;
    name: string;
    level: string;
    academic_year_id: number;
    grade_level_id: number;
    homeroom_teacher_id: number | null;
    academic_year: { title: string };
    grade_level: { label: string };
    homeroom_teacher: { name: string } | null;
}

interface Opt {
    id: number;
    title?: string;
    label?: string;
    name?: string;
    is_current?: boolean;
}

export default function Classes({ classGroups, gradeLevels, academicYearsList, gradeLevelsList, teachersList }: { classGroups: ClassGroup[], gradeLevels: GradeLevel[], academicYearsList: Opt[], gradeLevelsList: Opt[], teachersList: Opt[] }) {
    const [view, setView] = useState<'classes' | 'gradeLevels'>('classes');
    
    // Class Form State
    const [isClassFormOpen, setIsClassFormOpen] = useState(false);
    const [editingClassId, setEditingClassId] = useState<number | null>(null);
    const defaultYearId = academicYearsList?.find(y => y.is_current)?.id || (academicYearsList?.length > 0 ? academicYearsList[0].id : '');
    
    const classForm = useForm({
        name: '',
        academic_year_id: defaultYearId,
        grade_level_id: '',
        homeroom_teacher_id: '',
        level: '',
    });

    // Grade Level Form State
    const [isGradeFormOpen, setIsGradeFormOpen] = useState(false);
    const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
    
    const gradeForm = useForm({
        code: '',
        label: '',
        sort_order: 0,
    });

    // Class Handlers
    const openClassForm = (cls?: ClassGroup) => {
        if (cls) {
            classForm.setData({
                name: cls.name,
                academic_year_id: cls.academic_year_id,
                grade_level_id: cls.grade_level_id.toString(),
                homeroom_teacher_id: cls.homeroom_teacher_id?.toString() || '',
                level: cls.level || '',
            });
            setEditingClassId(cls.id);
        } else {
            classForm.reset();
            classForm.setData('academic_year_id', defaultYearId);
            setEditingClassId(null);
        }
        setIsClassFormOpen(true);
    };

    const submitClass = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...classForm.data, homeroom_teacher_id: classForm.data.homeroom_teacher_id || null };
        if (editingClassId) {
            router.patch(route('school-setup.class-groups.update', editingClassId), data as any, {
                preserveScroll: true,
                onSuccess: () => { toast.success('Class updated'); setIsClassFormOpen(false); },
            });
        } else {
            router.post(route('school-setup.class-groups.store'), data as any, {
                preserveScroll: true,
                onSuccess: () => { toast.success('Class created'); setIsClassFormOpen(false); },
            });
        }
    };

    const deleteClass = (id: number) => {
        if (confirm('Delete this class?')) {
            classForm.delete(route('school-setup.class-groups.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Class deleted'),
            });
        }
    };

    // Grade Level Handlers
    const openGradeForm = (grade?: GradeLevel) => {
        if (grade) {
            gradeForm.setData({
                code: grade.code,
                label: grade.label,
                sort_order: grade.sort_order,
            });
            setEditingGradeId(grade.id);
        } else {
            gradeForm.reset();
            setEditingGradeId(null);
        }
        setIsGradeFormOpen(true);
    };

    const submitGrade = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGradeId) {
            gradeForm.patch(route('school-setup.grade-levels.update', editingGradeId), {
                preserveScroll: true,
                onSuccess: () => { toast.success('Grade level updated'); setIsGradeFormOpen(false); },
            });
        } else {
            gradeForm.post(route('school-setup.grade-levels.store'), {
                preserveScroll: true,
                onSuccess: () => { toast.success('Grade level created'); setIsGradeFormOpen(false); },
            });
        }
    };

    const deleteGrade = (id: number) => {
        if (confirm('Delete this grade level?')) {
            gradeForm.delete(route('school-setup.grade-levels.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Grade level deleted'),
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Classes & Grade Levels</h3>
                    <p className="text-sm text-slate-500">Manage grade level templates and active class groups.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setView('classes')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'classes' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>Classes</button>
                    <button onClick={() => setView('gradeLevels')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'gradeLevels' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>Grade Levels</button>
                </div>
            </div>

            {view === 'classes' && (
                <div className="space-y-4">
                    {!isClassFormOpen ? (
                        <div className="flex justify-end">
                            <button onClick={() => openClassForm()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                                <Plus className="w-4 h-4" /> New Class
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-900">{editingClassId ? 'Edit Class' : 'Create Class'}</h4>
                                <button onClick={() => setIsClassFormOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={submitClass} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Class Name</label>
                                        <input type="text" value={classForm.data.name} onChange={e => classForm.setData('name', e.target.value)} placeholder="e.g., Form 3A" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Academic Year</label>
                                        <select value={classForm.data.academic_year_id} onChange={e => classForm.setData('academic_year_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                            <option value="">Select Year</option>
                                            {academicYearsList?.map(y => <option key={y.id} value={y.id}>{y.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Grade Level</label>
                                        <select value={classForm.data.grade_level_id} onChange={e => classForm.setData('grade_level_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                            <option value="">Select Grade</option>
                                            {gradeLevelsList?.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Class Teacher (Optional)</label>
                                        <select value={classForm.data.homeroom_teacher_id} onChange={e => classForm.setData('homeroom_teacher_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option value="">Select Teacher</option>
                                            {teachersList?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={classForm.processing} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl">Save Class</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!isClassFormOpen && (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Class Name</th>
                                        <th className="px-6 py-3">Grade Level</th>
                                        <th className="px-6 py-3">Academic Year</th>
                                        <th className="px-6 py-3">Class Teacher</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {classGroups?.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No classes configured.</td></tr>
                                    ) : (
                                        classGroups?.map((cls) => (
                                            <tr key={cls.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-900">{cls.name}</td>
                                                <td className="px-6 py-4 text-slate-600">{cls.grade_level?.label}</td>
                                                <td className="px-6 py-4 text-slate-600">{cls.academic_year?.title}</td>
                                                <td className="px-6 py-4 text-slate-600">{cls.homeroom_teacher?.name || '—'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => openClassForm(cls)} className="text-slate-400 hover:text-indigo-600"><Pencil className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteClass(cls.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
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
            )}

            {view === 'gradeLevels' && (
                <div className="space-y-4">
                    {!isGradeFormOpen ? (
                        <div className="flex justify-end">
                            <button onClick={() => openGradeForm()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                                <Plus className="w-4 h-4" /> New Grade Level
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-900">{editingGradeId ? 'Edit Grade Level' : 'Create Grade Level'}</h4>
                                <button onClick={() => setIsGradeFormOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={submitGrade} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Code</label>
                                        <input type="text" value={gradeForm.data.code} onChange={e => gradeForm.setData('code', e.target.value)} placeholder="e.g., F1" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Label</label>
                                        <input type="text" value={gradeForm.data.label} onChange={e => gradeForm.setData('label', e.target.value)} placeholder="e.g., Form 1" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Sort Order</label>
                                        <input type="number" value={gradeForm.data.sort_order} onChange={e => gradeForm.setData('sort_order', parseInt(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={gradeForm.processing} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl">Save Grade Level</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!isGradeFormOpen && (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Code</th>
                                        <th className="px-6 py-3">Label</th>
                                        <th className="px-6 py-3">Sort Order</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {gradeLevels?.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No grade levels configured.</td></tr>
                                    ) : (
                                        gradeLevels?.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-900">{grade.code}</td>
                                                <td className="px-6 py-4 text-slate-600">{grade.label}</td>
                                                <td className="px-6 py-4 text-slate-600">{grade.sort_order}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => openGradeForm(grade)} className="text-slate-400 hover:text-indigo-600"><Pencil className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteGrade(grade.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
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
            )}
        </div>
    );
}
