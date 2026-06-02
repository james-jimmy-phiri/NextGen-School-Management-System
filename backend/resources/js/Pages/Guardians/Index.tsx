import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ auth, guardians }: PageProps<{ guardians: any }>) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Parents & Guardians</h2>}
        >
            <Head title="Guardians" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {guardians?.data?.map((guardian: any) => (
                                        <tr key={guardian.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {guardian.first_name} {guardian.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {guardian.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {guardian.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={route('guardians.edit', guardian.id)} className="text-indigo-600 hover:text-indigo-900">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!guardians || !guardians.data || guardians.data.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                No guardians registered yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
