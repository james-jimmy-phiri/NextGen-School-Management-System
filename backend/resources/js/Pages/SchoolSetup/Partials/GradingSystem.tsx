import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface GradingScale {
    id?: number;
    min_score: number;
    max_score: number;
    grade: string;
    remark: string;
    points: number;
}

interface GradingSystem {
    id: number;
    name: string;
    type: string;
    is_default: boolean;
    scales: GradingScale[];
}

export default function GradingSystem({ gradingSystems }: { gradingSystems: GradingSystem[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        type: 'percentage',
        is_default: false,
        scales: [] as GradingScale[],
    });

    const openCreateForm = () => {
        reset();
        setData('scales', [
            { min_score: 80, max_score: 100, grade: 'A', remark: 'Excellent', points: 4.0 },
            { min_score: 60, max_score: 79, grade: 'B', remark: 'Good', points: 3.0 },
        ]);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (system: GradingSystem) => {
        setData({
            name: system.name,
            type: system.type,
            is_default: system.is_default,
            scales: system.scales || [],
        });
        setEditingId(system.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        reset();
        setEditingId(null);
    };

    const addScale = () => {
        setData('scales', [...data.scales, { min_score: 0, max_score: 0, grade: '', remark: '', points: 0 }]);
    };

    const removeScale = (index: number) => {
        const newScales = [...data.scales];
        newScales.splice(index, 1);
        setData('scales', newScales);
    };

    const updateScale = (index: number, field: keyof GradingScale, value: string | number) => {
        const newScales = [...data.scales];
        newScales[index] = { ...newScales[index], [field]: value };
        setData('scales', newScales);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            patch(route('school-setup.grading-systems.update', editingId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Grading system updated');
                    closeForm();
                },
            });
        } else {
            post(route('school-setup.grading-systems.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Grading system created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this grading system?')) {
            destroy(route('school-setup.grading-systems.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Grading system deleted'),
            });
        }
    };

    const handleSetDefault = (system: GradingSystem) => {
        router.patch(route('school-setup.grading-systems.update', system.id), {
            ...system,
            is_default: true,
        } as any, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${system.name} set as default grading system`),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Grading Systems</h3>
                    <p className="text-sm text-slate-500">Configure scales and remark bands for student assessments.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New System
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Grading System' : 'Create Grading System'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">System Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., Standard Percentage" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="percentage">Percentage</option>
                                    <option value="gpa">GPA</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-center mt-2">
                                <input type="checkbox" id="is_default" checked={data.is_default} onChange={e => setData('is_default', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                                <label htmlFor="is_default" className="ml-2 text-sm text-slate-700 font-medium">Set as Default Grading System</label>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                            <div className="bg-slate-100 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                                <h5 className="font-bold text-sm text-slate-700">Grading Scales</h5>
                                <button type="button" onClick={addScale} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Row
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                {data.scales.map((scale, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <div className="grid grid-cols-5 gap-2 flex-1">
                                            <div>
                                                <input type="number" step="0.1" value={scale.min_score} onChange={e => updateScale(idx, 'min_score', e.target.value)} placeholder="Min" className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500" required />
                                            </div>
                                            <div>
                                                <input type="number" step="0.1" value={scale.max_score} onChange={e => updateScale(idx, 'max_score', e.target.value)} placeholder="Max" className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500" required />
                                            </div>
                                            <div>
                                                <input type="text" value={scale.grade} onChange={e => updateScale(idx, 'grade', e.target.value)} placeholder="Grade" className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500" required />
                                            </div>
                                            <div>
                                                <input type="number" step="0.1" value={scale.points} onChange={e => updateScale(idx, 'points', e.target.value)} placeholder="Points" className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500" required />
                                            </div>
                                            <div>
                                                <input type="text" value={scale.remark} onChange={e => updateScale(idx, 'remark', e.target.value)} placeholder="Remark" className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeScale(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {data.scales.length === 0 && (
                                    <p className="text-center text-sm text-slate-500 py-4">No scales defined. Click "Add Row" to add bands.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Grading System'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(!gradingSystems || gradingSystems.length === 0) ? (
                        <div className="col-span-full py-12 text-center text-slate-500 border border-slate-200 rounded-2xl bg-slate-50">
                            No grading systems configured.
                        </div>
                    ) : (
                        gradingSystems.map((system) => (
                            <div key={system.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-200 transition-colors">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-lg font-bold text-slate-900">{system.name}</h4>
                                            {system.is_default && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">Default</span>}
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600">
                                            {system.type} Based
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {!system.is_default && (
                                            <button onClick={() => handleSetDefault(system)} title="Set Default" className="text-slate-400 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
                                        )}
                                        <button onClick={() => openEditForm(system)} className="text-slate-400 hover:text-indigo-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(system.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-0">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 text-xs">
                                            <tr>
                                                <th className="px-5 py-2 font-medium">Range</th>
                                                <th className="px-5 py-2 font-medium">Grade</th>
                                                <th className="px-5 py-2 font-medium">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {system.scales?.sort((a,b) => b.min_score - a.min_score).map((scale, i) => (
                                                <tr key={i}>
                                                    <td className="px-5 py-2 text-slate-600">{scale.min_score} - {scale.max_score}</td>
                                                    <td className="px-5 py-2 font-bold text-slate-900">{scale.grade}</td>
                                                    <td className="px-5 py-2 text-slate-600">{scale.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
