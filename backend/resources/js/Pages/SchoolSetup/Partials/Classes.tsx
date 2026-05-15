import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ClassGroup {
    id: number;
    name: string;
    level: string;
    academic_year: { title: string };
    homeroom_teacher: { name: string } | null;
}

export default function Classes() {
    const [classes, setClasses] = useState<ClassGroup[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/classes');
            setClasses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Classes</h3>
                    <p className="text-sm text-slate-500">Manage school classes, grade levels, and class teachers.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New Class
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Class Name</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Academic Year</th>
                                <th className="px-6 py-3">Class Teacher</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {classes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No classes configured.</td>
                                </tr>
                            ) : (
                                classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{cls.name}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">{cls.level || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{cls.academic_year?.title}</td>
                                        <td className="px-6 py-4 text-slate-600">{cls.homeroom_teacher?.name || 'Unassigned'}</td>
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
