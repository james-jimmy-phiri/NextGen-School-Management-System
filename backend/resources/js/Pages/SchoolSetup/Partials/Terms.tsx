import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Term {
    id: number;
    name: string;
    starts_on: string;
    ends_on: string;
    is_active: boolean;
    academic_year: { title: string };
}

export default function Terms() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTerms = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/terms');
            setTerms(response.data.data);
        } catch (error) {
            console.error('Failed to fetch terms', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Terms / Semesters</h3>
                    <p className="text-sm text-slate-500">Manage academic terms or semesters within years.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New Term
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
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
                            {terms.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No terms configured.</td>
                                </tr>
                            ) : (
                                terms.map((term) => (
                                    <tr key={term.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{term.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{term.academic_year?.title}</td>
                                        <td className="px-6 py-4 text-slate-600">{term.starts_on} - {term.ends_on}</td>
                                        <td className="px-6 py-4">
                                            {term.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Inactive</span>
                                            )}
                                        </td>
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
