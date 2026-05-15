import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Department {
    id: number;
    name: string;
    type: string;
    description: string;
    head_of_department: { name: string } | null;
}

export default function Departments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/departments');
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Departments</h3>
                    <p className="text-sm text-slate-500">Manage academic and administrative departments.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New Department
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 border border-slate-200 rounded-2xl bg-slate-50">
                            No departments configured.
                        </div>
                    ) : (
                        departments.map((dept) => (
                            <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${dept.type === 'academic' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {dept.type}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 text-slate-400 hover:text-indigo-600"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h4>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{dept.description || 'No description provided.'}</p>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Head of Department</p>
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
