import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Apply({ auth, school }: PageProps<{ school: any }>) {
    const { data, setData, post, processing, errors } = useForm({
        school_id: school.id,
        student_first_name: '',
        student_last_name: '',
        gender: '',
        date_of_birth: '',
        parent_first_name: '',
        parent_last_name: '',
        parent_email: '',
        parent_phone: '',
        relationship: 'Parent',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('apply.store'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <Head title="Student Application" />
            
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Apply to {school.name}</h2>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Student First Name</label>
                        <input
                            type="text"
                            value={data.student_first_name}
                            onChange={(e) => setData('student_first_name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.student_first_name && <div className="text-red-500 text-xs mt-1">{errors.student_first_name}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                        <input
                            type="email"
                            value={data.parent_email}
                            onChange={(e) => setData('parent_email', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.parent_email && <div className="text-red-500 text-xs mt-1">{errors.parent_email}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
}
