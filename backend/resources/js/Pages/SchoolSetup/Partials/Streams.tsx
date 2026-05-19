import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Stream {
    id: number;
    name: string;
    class_group_id: number;
    classroom: string | null;
    capacity: number | null;
    class_group: {
        name: string;
        grade_level: { label: string };
        academic_year: { title: string };
    };
}

interface Opt {
    id: number;
    name: string;
}

export default function Streams({ streams, classGroupsList }: { streams: Stream[], classGroupsList: Opt[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        class_group_id: '',
        classroom: '',
        capacity: '',
    });

    const openCreateForm = () => {
        reset();
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (stream: Stream) => {
        setData({
            name: stream.name,
            class_group_id: stream.class_group_id.toString(),
            classroom: stream.classroom || '',
            capacity: stream.capacity?.toString() || '',
        });
        setEditingId(stream.id);
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
            capacity: data.capacity ? parseInt(data.capacity) : null,
        };

        if (editingId) {
            router.patch(route('school-setup.streams.update', editingId), submitData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Stream updated');
                    closeForm();
                },
            });
        } else {
            router.post(route('school-setup.streams.store'), submitData as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Stream created');
                    closeForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this stream?')) {
            destroy(route('school-setup.streams.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Stream deleted'),
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Streams</h3>
                    <p className="text-sm text-slate-500">Manage classroom streams linked to class groups.</p>
                </div>
                {!isFormOpen && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                        New Stream
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">{editingId ? 'Edit Stream' : 'Create Stream'}</h4>
                        <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Class Group</label>
                                <select value={data.class_group_id} onChange={e => setData('class_group_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                    <option value="" disabled>Select Class</option>
                                    {classGroupsList?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.class_group_id && <p className="text-red-500 text-xs mt-1">{errors.class_group_id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Stream Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., A, B, North, Blue" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Physical Classroom (Optional)</label>
                                <input type="text" value={data.classroom} onChange={e => setData('classroom', e.target.value)} placeholder="e.g., Block A, Room 12" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Capacity (Optional)</label>
                                <input type="number" min="1" value={data.capacity} onChange={e => setData('capacity', e.target.value)} placeholder="e.g., 40" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Stream'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Stream Name</th>
                                <th className="px-6 py-3">Class Group</th>
                                <th className="px-6 py-3">Classroom</th>
                                <th className="px-6 py-3">Capacity</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!streams || streams.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No streams configured.</td>
                                </tr>
                            ) : (
                                streams.map((stream) => (
                                    <tr key={stream.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{stream.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{stream.class_group?.name} <span className="text-xs text-slate-400 block">{stream.class_group?.academic_year?.title}</span></td>
                                        <td className="px-6 py-4 text-slate-600">{stream.classroom || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600">{stream.capacity || '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditForm(stream)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(stream.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
