import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';

interface GradingScale {
    id: number;
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

export default function GradingSystem() {
    const [systems, setSystems] = useState<GradingSystem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSystems = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/grading-systems');
            setSystems(response.data.data);
        } catch (error) {
            console.error('Failed to fetch grading systems', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystems();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Grading Systems</h3>
                    <p className="text-sm text-slate-500">Configure academic grading scales, GPA settings, and automatic remarks.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New System
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="space-y-6">
                    {systems.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 border border-slate-200 rounded-2xl bg-slate-50">
                            No grading systems configured.
                        </div>
                    ) : (
                        systems.map((system) => (
                            <div key={system.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                                {system.name}
                                                {system.is_default && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700">Default</span>}
                                            </h4>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Type: {system.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-slate-400 hover:bg-slate-200 hover:text-indigo-600 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                                        <button className="p-2 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="px-6 py-3 border-b border-slate-100">Score Range</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Grade</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Points (GPA)</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {system.scales?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-center text-slate-400 text-xs font-medium">No scales added yet.</td>
                                                </tr>
                                            ) : (
                                                system.scales?.sort((a, b) => b.min_score - a.min_score).map((scale) => (
                                                    <tr key={scale.id} className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-3 text-slate-600 font-medium">{scale.min_score}% - {scale.max_score}%</td>
                                                        <td className="px-6 py-3 font-bold text-slate-900">{scale.grade}</td>
                                                        <td className="px-6 py-3 text-slate-500">{scale.points}</td>
                                                        <td className="px-6 py-3 text-slate-500 italic">{scale.remark || '-'}</td>
                                                    </tr>
                                                ))
                                            )}
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
