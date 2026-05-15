import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Subject {
    id: number;
    code: string;
    name: string;
    type: string;
    pass_mark: string;
    department: { name: string } | null;
    teacher: { name: string } | null;
}

export default function Subjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/subjects');
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Subjects</h3>
                    <p className="text-sm text-slate-500">Manage curriculum subjects, teachers, and pass marks.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New Subject
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Pass Mark</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {subjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No subjects configured.</td>
                                </tr>
                            ) : (
                                subjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-500">{subject.code}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{subject.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{subject.department?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${subject.type === 'compulsory' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {subject.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{subject.pass_mark}%</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                <button className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
