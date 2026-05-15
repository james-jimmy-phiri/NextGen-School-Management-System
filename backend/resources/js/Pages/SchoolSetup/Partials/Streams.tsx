import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Stream {
    id: number;
    name: string;
    classroom: string;
    capacity: number;
    class_group: { name: string };
}

export default function Streams() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStreams = async () => {
        try {
            const response = await axios.get('/api/v1/school-setup/streams');
            setStreams(response.data.data);
        } catch (error) {
            console.error('Failed to fetch streams', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreams();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Streams / Sections</h3>
                    <p className="text-sm text-slate-500">Manage class streams, sections, and classroom capacities.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                    <Plus className="w-4 h-4" />
                    New Stream
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Stream Name</th>
                                <th className="px-6 py-3">Parent Class</th>
                                <th className="px-6 py-3">Classroom</th>
                                <th className="px-6 py-3">Capacity</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {streams.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No streams configured.</td>
                                </tr>
                            ) : (
                                streams.map((stream) => (
                                    <tr key={stream.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{stream.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{stream.class_group?.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{stream.classroom || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-slate-600">{stream.capacity || 'N/A'}</td>
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
