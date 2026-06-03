import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, Users, GraduationCap, ArrowRight, Settings, School, ChevronRight } from 'lucide-react';

interface Subject {
    id: number;
    name: string;
    code: string;
    gpa_weight: number;
    class_groups_count: number;
    students_count: number;
}

const subjectColors = [
    { bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', icon: 'text-indigo-500' },
    { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: 'text-emerald-500' },
    { bg: 'bg-amber-50',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',   icon: 'text-amber-500' },
    { bg: 'bg-rose-50',    badge: 'bg-rose-100 text-rose-700',    dot: 'bg-rose-500',    icon: 'text-rose-500' },
    { bg: 'bg-sky-50',     badge: 'bg-sky-100 text-sky-700',     dot: 'bg-sky-500',     icon: 'text-sky-500' },
    { bg: 'bg-purple-50',  badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500',  icon: 'text-purple-500' },
];

export default function Index({ subjects }: { subjects: Subject[] }) {
    const user = (usePage().props.auth as any).user;
    const canManageSchoolSetup = user?.permissions?.includes('school.manage') ||
        user?.permissions?.includes('settings.manage');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">Academic Subjects</h2>
                        <p className="text-sm text-gray-500 mt-0.5">View subject assignments across classes and manage teacher allocations</p>
                    </div>
                    {canManageSchoolSetup && (
                        <Link
                            href={route('school-setup.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Add / Edit Subjects in School Setup
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Academic Subjects" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                        <School className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
                        <div>
                            <strong>Operational View Only.</strong> To create, rename, or delete Subjects, go to{' '}
                            <Link href={route('school-setup.index')} className="underline font-semibold hover:text-blue-900">
                                School Setup → Subjects
                            </Link>
                            . Use this page to view subject coverage and drill into each subject's class and teacher assignments.
                        </div>
                    </div>

                    {/* Stats Bar */}
                    {subjects.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-3xl font-bold text-indigo-600">{subjects.length}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Subjects</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-3xl font-bold text-emerald-600">
                                    {subjects.reduce((s, sub) => s + (sub.class_groups_count ?? 0), 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Class Assignments</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-3xl font-bold text-amber-600">
                                    {subjects.reduce((s, sub) => s + (sub.students_count ?? 0), 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Student Enrolments</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-3xl font-bold text-sky-600">
                                    {subjects.length > 0
                                        ? (subjects.reduce((s, sub) => s + Number(sub.gpa_weight ?? 0), 0) / subjects.length).toFixed(1)
                                        : '–'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Avg GPA Weight</p>
                            </div>
                        </div>
                    )}

                    {/* Subject Grid */}
                    {subjects.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">No Subjects Found</h3>
                            <p className="text-gray-500 mt-1 mb-4">Start by creating Subjects in School Setup.</p>
                            {canManageSchoolSetup && (
                                <Link
                                    href={route('school-setup.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Go to School Setup
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {subjects.map((subject, index) => {
                                const colors = subjectColors[index % subjectColors.length];
                                return (
                                    <Link
                                        key={subject.id}
                                        href={route('academics.subjects.manage', subject.id)}
                                        className="group block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                                    >
                                        {/* Card header */}
                                        <div className={`${colors.bg} p-5`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className={`inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded ${colors.badge} mb-2`}>
                                                        {subject.code}
                                                    </span>
                                                    <h4 className="text-base font-bold text-gray-800 leading-tight">{subject.name}</h4>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="p-4 space-y-2.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Users className={`w-4 h-4 ${colors.icon}`} />
                                                    <span>Classes</span>
                                                </div>
                                                <span className="font-bold text-gray-800">{subject.class_groups_count}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <GraduationCap className={`w-4 h-4 ${colors.icon}`} />
                                                    <span>Students</span>
                                                </div>
                                                <span className="font-bold text-gray-800">{subject.students_count}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <BookOpen className={`w-4 h-4 ${colors.icon}`} />
                                                    <span>GPA Weight</span>
                                                </div>
                                                <span className="font-bold text-gray-800">{Number(subject.gpa_weight).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <div className="px-4 pb-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:gap-2.5 transition-all">
                                                View Details & Assignments <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
