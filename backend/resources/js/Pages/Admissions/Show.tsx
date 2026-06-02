import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, CheckCircle2, XCircle, Clock, UserPlus, FileText, Download } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { format } from 'date-fns';

export default function Show({ admission, flash }: PageProps<{ admission: any, flash: any }>) {
    const { post, processing: enrollProcessing } = useForm();

    const updateStatus = (newStatus: string) => {
        if (confirm(`Are you sure you want to mark this application as ${newStatus.replace('_', ' ')}?`)) {
            router.put(route('admissions.updateStatus', admission.id), { status: newStatus });
        }
    };

    const handleEnroll = () => {
        if (confirm('This will create a new Student and Guardian record. Continue?')) {
            post(route('admissions.enroll', admission.id));
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-amber-100 text-amber-800',
            accepted: 'bg-emerald-100 text-emerald-800',
            rejected: 'bg-rose-100 text-rose-800',
            waitlisted: 'bg-purple-100 text-purple-800',
            enrolled: 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Application ${admission.reference_number}`} />

            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link href={route('admissions.index')} className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Admissions
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                            {admission.student_first_name} {admission.student_last_name}
                            {getStatusBadge(admission.status)}
                        </h1>
                        <p className="text-gray-500 mt-1 font-mono text-sm">REF: {admission.reference_number} • Applied {format(new Date(admission.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    
                    <div className="flex gap-2">
                        {admission.status === 'submitted' && (
                            <PrimaryButton onClick={() => updateStatus('under_review')} className="bg-amber-600 hover:bg-amber-700 focus:bg-amber-700">
                                <Clock className="w-4 h-4 mr-2" /> Mark Under Review
                            </PrimaryButton>
                        )}
                        {['submitted', 'under_review'].includes(admission.status) && (
                            <>
                                <PrimaryButton onClick={() => updateStatus('accepted')} className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                                </PrimaryButton>
                                <SecondaryButton onClick={() => updateStatus('rejected')} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                </SecondaryButton>
                            </>
                        )}
                        {admission.status === 'accepted' && (
                            <PrimaryButton onClick={handleEnroll} disabled={enrollProcessing} className="bg-primary hover:bg-primary/90">
                                <UserPlus className="w-4 h-4 mr-2" /> Convert to Student
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {flash.success}
                    </div>
                )}
                
                {flash?.error && (
                    <div className="mb-6 bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-600" />
                        {flash.error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Student Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Student Details</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.student_first_name} {admission.student_middle_name} {admission.student_last_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{admission.gender}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.date_of_birth ? format(new Date(admission.date_of_birth), 'MMM d, yyyy') : 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.nationality || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Religion</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.religion || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Birth Cert / ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.birth_certificate_number || 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Academic Background */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Academic Background</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Previous School</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.previous_school_name || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Previous Grade</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.previous_grade || 'N/A'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Transfer Reason</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.transfer_reason || 'N/A'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Boarding Preference</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{admission.boarding_type}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Parent Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Parent / Guardian</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900">{admission.parent_name}</dd>
                                    <dd className="text-xs text-gray-500 capitalize">{admission.parent_relationship}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.parent_phone}</dd>
                                    <dd className="text-sm text-gray-900">{admission.parent_email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.parent_occupation || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{admission.parent_address}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Documents */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Documents</h3>
                            {admission.documents && Object.keys(admission.documents).length > 0 ? (
                                <ul className="space-y-3">
                                    {Object.entries(admission.documents).map(([key, path]) => (
                                        <li key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                                            </div>
                                            <a href={`/storage/${path as string}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
