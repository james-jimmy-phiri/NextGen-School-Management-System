import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, Search, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function Index({ admissions }: PageProps<{ admissions: any[] }>) {
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-amber-100 text-amber-800',
            accepted: 'bg-emerald-100 text-emerald-800',
            rejected: 'bg-rose-100 text-rose-800',
            waitlisted: 'bg-purple-100 text-purple-800',
            enrolled: 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admissions Management" />

            <div className="max-w-7xl mx-auto py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admissions</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage prospective student applications.</p>
                    </div>
                    <Link
                        href={route('admissions.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        New Application
                    </Link>
                </div>

                <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, reference..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Applicant Name</th>
                                    <th className="px-6 py-4">Applied On</th>
                                    <th className="px-6 py-4">Boarding</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {admissions.map((admission) => (
                                    <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                            {admission.reference_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {admission.student_first_name} {admission.student_last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {admission.parent_name} ({admission.parent_relationship})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {format(new Date(admission.created_at), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 capitalize">
                                            {admission.boarding_type}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(admission.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route('admissions.show', admission.id)}
                                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {admissions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
