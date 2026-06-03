import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SchoolPublicLayout, { type SchoolBrandingProps } from '@/Layouts/SchoolPublicLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Search, AlertCircle, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function Track({
    school,
    admission,
    referenceQuery,
    error,
}: PageProps<{ school: SchoolBrandingProps; admission: any; referenceQuery: string; error: string }>) {
    const [reference, setReference] = useState(referenceQuery || '');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('public.admissions.track'), { reference }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'submitted':
                return {
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: <FileText className="w-8 h-8 text-blue-500 mb-2" />,
                    text: 'Application Submitted',
                    description: 'Your application has been received and is waiting to be reviewed.'
                };
            case 'under_review':
                return {
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: <Clock className="w-8 h-8 text-amber-500 mb-2" />,
                    text: 'Under Review',
                    description: 'Your application is currently being reviewed by our admissions team.'
                };
            case 'accepted':
                return {
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    icon: <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />,
                    text: 'Accepted',
                    description: 'Congratulations! Your application has been accepted.'
                };
            case 'rejected':
                return {
                    color: 'text-rose-600',
                    bg: 'bg-rose-50',
                    border: 'border-rose-200',
                    icon: <XCircle className="w-8 h-8 text-rose-500 mb-2" />,
                    text: 'Rejected',
                    description: 'Unfortunately, your application was not successful at this time.'
                };
            case 'enrolled':
                return {
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    icon: <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />,
                    text: 'Enrolled',
                    description: 'The student has been officially enrolled.'
                };
            default:
                return {
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    icon: <AlertCircle className="w-8 h-8 text-gray-500 mb-2" />,
                    text: status.replace('_', ' ').toUpperCase(),
                    description: 'Status unavailable.'
                };
        }
    };

    const statusInfo = admission ? getStatusInfo(admission.status) : null;

    const applyHref = school.slug
        ? route('public.admissions.create', { school: school.slug })
        : route('public.admissions.create');

    return (
        <SchoolPublicLayout
            school={school}
            title="Track your application"
            subtitle="Enter the reference number from your confirmation email or receipt."
        >
            <Head title="Track Application Status" />

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <InputLabel htmlFor="reference" value="Reference Number" />
                            <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <TextInput 
                                    id="reference" 
                                    type="text" 
                                    className="pl-10 block w-full uppercase" 
                                    placeholder="e.g. APP-2026-X7Y8Z9"
                                    value={reference} 
                                    onChange={e => setReference(e.target.value.toUpperCase())} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <PrimaryButton type="submit" className="justify-center py-3 text-base">
                            Check Status
                        </PrimaryButton>
                    </form>

                    {error && (
                        <div className="mt-6 bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200 flex items-start gap-3">
                            <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                            <p>{error}</p>
                        </div>
                    )}

                    {admission && statusInfo && (
                        <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Application Found</h3>
                            
                            <div className={`p-6 rounded-2xl border ${statusInfo.bg} ${statusInfo.border} text-center flex flex-col items-center justify-center`}>
                                {statusInfo.icon}
                                <h4 className={`text-xl font-bold ${statusInfo.color}`}>{statusInfo.text}</h4>
                                <p className="text-sm mt-2 opacity-80 mix-blend-multiply">{statusInfo.description}</p>
                            </div>

                            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Applicant Name</dt>
                                    <dd className="text-sm font-medium text-gray-900">{admission.student_first_name} {admission.student_last_name}</dd>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Grade Applied</dt>
                                    <dd className="text-sm font-medium text-gray-900">{admission.previous_grade || 'N/A'}</dd>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Boarding</dt>
                                    <dd className="text-sm font-medium text-gray-900 capitalize">{admission.boarding_type}</dd>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Submitted On</dt>
                                    <dd className="text-sm font-medium text-gray-900">{new Date(admission.created_at).toLocaleDateString()}</dd>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Link href={applyHref} className="text-sm font-medium hover:underline" style={{ color: school.primary_color }}>
                        Apply for a new admission
                    </Link>
                </div>
        </SchoolPublicLayout>
    );
}
