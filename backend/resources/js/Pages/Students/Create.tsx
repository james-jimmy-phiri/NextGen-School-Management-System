import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        school_id: auth.user?.school_id,
        student_first_name: '',
        student_last_name: '',
        gender: 'male',
        date_of_birth: '',
        parent_first_name: '',
        parent_last_name: '',
        parent_email: '',
        parent_phone: '',
        relationship: 'Parent',
    });

    const [step, setStep] = useState(1);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('students.store'));
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Register New Student
                </h2>
            }
        >
            <Head title="Register Student" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Stepper Header */}
                            <div className="mb-8 flex justify-between items-center px-4">
                                <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>1</div>
                                    <span className="text-xs mt-2 font-medium uppercase tracking-wide">Student Details</span>
                                </div>
                                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>2</div>
                                    <span className="text-xs mt-2 font-medium uppercase tracking-wide">Parent Details</span>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Step 1: Student Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                                <input
                                                    type="text"
                                                    value={data.student_first_name}
                                                    onChange={(e) => setData('student_first_name', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.student_first_name && <p className="text-red-500 text-xs mt-1">{errors.student_first_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={data.student_last_name}
                                                    onChange={(e) => setData('student_last_name', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.student_last_name && <p className="text-red-500 text-xs mt-1">{errors.student_last_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                                <select
                                                    value={data.gender}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={data.date_of_birth}
                                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Step 2: Parent / Guardian Information</h3>
                                        <p className="text-sm text-gray-500">We will use this email to grant portal access to the parent.</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Parent First Name</label>
                                                <input
                                                    type="text"
                                                    value={data.parent_first_name}
                                                    onChange={(e) => setData('parent_first_name', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.parent_first_name && <p className="text-red-500 text-xs mt-1">{errors.parent_first_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Parent Last Name</label>
                                                <input
                                                    type="text"
                                                    value={data.parent_last_name}
                                                    onChange={(e) => setData('parent_last_name', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.parent_last_name && <p className="text-red-500 text-xs mt-1">{errors.parent_last_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                                                <input
                                                    type="email"
                                                    value={data.parent_email}
                                                    onChange={(e) => setData('parent_email', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                                                <input
                                                    type="text"
                                                    value={data.parent_phone}
                                                    onChange={(e) => setData('parent_phone', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.parent_phone && <p className="text-red-500 text-xs mt-1">{errors.parent_phone}</p>}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Relationship to Student</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Mother, Father, Uncle"
                                                    value={data.relationship}
                                                    onChange={(e) => setData('relationship', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    required
                                                />
                                                {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    {step > 1 && (
                                        <SecondaryButton type="button" onClick={prevStep}>
                                            Back
                                        </SecondaryButton>
                                    )}
                                    {step < 2 && (
                                        <PrimaryButton type="button" onClick={nextStep}>
                                            Next Step
                                        </PrimaryButton>
                                    )}
                                    {step === 2 && (
                                        <PrimaryButton disabled={processing} type="submit">
                                            Register Student & Parent
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
