import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, Users, UserCog, GraduationCap } from 'lucide-react';

export default function Show({ subject, teacherAllocations }: any) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{subject.name} - Subject Overview</h2>}>
            <Head title={`${subject.name} Overview`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{subject.name}</h3>
                                    <p className="text-gray-500 font-mono mt-1">{subject.code}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-center">
                                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                                    <span className="block text-xl font-bold text-indigo-700">{subject.class_groups?.length || 0}</span>
                                    <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Classes</span>
                                </div>
                                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                    <span className="block text-xl font-bold text-blue-700">{subject.students?.length || 0}</span>
                                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">Students</span>
                                </div>
                                <div className="bg-orange-50 px-4 py-2 rounded-lg">
                                    <span className="block text-xl font-bold text-orange-700">{teacherAllocations?.length || 0}</span>
                                    <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">Teachers</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Classes Enrolled */}
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                                Classes Taught In
                            </h4>
                            <div className="space-y-3">
                                {subject.class_groups?.map((cls: any) => (
                                    <div key={cls.id} className="flex justify-between items-center p-3 border border-gray-100 bg-gray-50 rounded-lg">
                                        <div>
                                            <Link href={route('academics.classes.manage', cls.id)} className="font-semibold text-indigo-600 hover:text-indigo-800">
                                                {cls.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">{cls.academic_year?.title}</p>
                                        </div>
                                        <div className="text-sm">
                                            {cls.pivot?.is_core ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Core Subject</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold">Elective</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!subject.class_groups || subject.class_groups.length === 0) && (
                                    <p className="text-gray-500 text-sm text-center py-4">This subject is not assigned to any classes yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Teacher Allocations */}
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <UserCog className="w-5 h-5 mr-2 text-orange-500" />
                                Subject Teachers
                            </h4>
                            <div className="space-y-3">
                                {teacherAllocations?.map((alloc: any) => (
                                    <div key={alloc.id} className="flex flex-col p-3 border border-gray-100 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-semibold text-gray-900">{alloc.teacher?.name}</div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
                                            <span><strong>Class:</strong> {alloc.class_group?.name}</span>
                                            {alloc.stream && <span><strong>Stream:</strong> {alloc.stream.name}</span>}
                                        </div>
                                    </div>
                                ))}
                                {(!teacherAllocations || teacherAllocations.length === 0) && (
                                    <p className="text-gray-500 text-sm text-center py-4">No teachers have been assigned to teach this subject yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
