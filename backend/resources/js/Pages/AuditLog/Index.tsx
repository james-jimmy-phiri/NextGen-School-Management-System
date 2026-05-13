import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PageProps, LaravelPagination, PaginationLink } from '@/types';

interface AuditLog {
    id: number;
    log_name: string;
    description: string;
    subject_type: string;
    event: string;
    causer_id: number;
    causer?: {
        id: number;
        name: string;
        email: string;
    };
    properties: Record<string, any>;
    created_at: string;
}



interface Props extends PageProps {
    logs: LaravelPagination<AuditLog>;
    filters: {
        user_id?: string;
        action?: string;
    };
}

export default function AuditLogIndex({ logs, filters }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                        System Integrity
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Audit Logs
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        Historical record of all critical system mutations and operational events.
                    </p>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div className="space-y-6">
                {/* Search / Filter (Simple) */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex gap-4">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Filter by action or event..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            defaultValue={filters.action}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.get(route('audit-logs.index'), { ...filters, action: (e.target as HTMLInputElement).value }, { preserveState: true });
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Logs List */}
                <div className="space-y-4">
                    {logs.data.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg shadow-sm border ${
                                        log.description === 'created' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        log.description === 'updated' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                        log.description === 'deleted' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                        'bg-slate-50 border-slate-100 text-slate-600'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {log.description === 'created' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />}
                                            {log.description === 'updated' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                                            {log.description === 'deleted' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />}
                                            {!['created', 'updated', 'deleted'].includes(log.description) && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black uppercase tracking-widest text-slate-900">{log.description}</span>
                                            <span className="text-sm text-slate-500 font-medium">on</span>
                                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                {log.subject_type.split('\\').pop()}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mt-2">
                                            Executed by <span className="font-bold text-slate-700">{log.causer?.name ?? 'System Process'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                                        {new Date(log.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {/* Details (simplified) */}
                            {log.properties && Object.keys(log.properties).length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(log.properties.attributes || {}).map(([key, value]) => (
                                        <div key={key} className="flex flex-col bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key.replace('_', ' ')}</span>
                                            <span className="text-xs font-bold text-slate-700 mt-1 truncate">
                                                {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                        Total Audit Events: <span className="font-bold text-slate-900">{logs.total}</span>
                    </p>
                    <div className="flex gap-2">
                        {logs.links.map((link: PaginationLink) => (
                            <button
                                key={link.label}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, filters, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                    link.active 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                                } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
