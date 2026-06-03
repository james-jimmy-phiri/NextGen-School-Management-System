import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Users, BookOpen, GraduationCap, ArrowRight, Settings, School,
    ChevronRight, Layers
} from 'lucide-react';

interface Stream {
    id: number;
    name: string;
    capacity: number;
}

interface ClassGroup {
    id: number;
    name: string;
    room?: string;
    grade_level: { id: number; label: string; code: string };
    academic_year: { id: number; title: string; is_current: boolean };
    streams: Stream[];
    enrollments_count: number;
}

const gradeColors: Record<string, string> = {
    default: 'from-indigo-500 to-violet-600',
};

function getGradeColor(index: number): string {
    const palette = [
        'from-indigo-500 to-violet-600',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-amber-600',
        'from-sky-500 to-blue-600',
        'from-rose-500 to-pink-600',
        'from-purple-500 to-fuchsia-600',
    ];
    return palette[index % palette.length];
}

export default function Index({ classes }: { classes: ClassGroup[] }) {
    const user = (usePage().props.auth as any).user;
    const canManageSchoolSetup = user?.permissions?.includes('school.manage') ||
        user?.permissions?.includes('settings.manage');

    const grouped = classes.reduce((acc: Record<string, ClassGroup[]>, cls) => {
        const key = cls.grade_level?.label ?? 'Ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(cls);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">Academic Classes</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage subject assignments, teacher allocations, and student enrolments</p>
                    </div>
                    {canManageSchoolSetup && (
                        <Link
                            href={route('school-setup.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Add / Edit Classes in School Setup
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Academic Classes" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                        <School className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
                        <div>
                            <strong>Operational View Only.</strong> To create, rename, or delete Class Groups, go to{' '}
                            <Link href={route('school-setup.index')} className="underline font-semibold hover:text-blue-900">
                                School Setup → Classes
                            </Link>
                            . Use this page to assign subjects, allocate teachers, and manage student enrolments.
                        </div>
                    </div>

                    {Object.keys(grouped).length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">No Classes Found</h3>
                            <p className="text-gray-500 mt-1 mb-4">Start by creating Class Groups in School Setup.</p>
                            {canManageSchoolSetup && (
                                <Link
                                    href={route('school-setup.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Go to School Setup
                                </Link>
                            )}
                        </div>
                    ) : (
                        Object.entries(grouped).map(([gradeLabel, gradeClasses], groupIndex) => (
                            <div key={gradeLabel}>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 px-1">
                                    {gradeLabel}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {gradeClasses.map((cls) => (
                                        <Link
                                            key={cls.id}
                                            href={route('academics.classes.manage', cls.id)}
                                            className="group block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                                        >
                                            {/* Coloured Header */}
                                            <div className={`bg-gradient-to-br ${getGradeColor(groupIndex)} p-5`}>
                                                <div className="flex items-start justify-between">
                                                    <h4 className="text-xl font-bold text-white leading-tight">{cls.name}</h4>
                                                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <p className="text-white/80 text-xs mt-1">{cls.academic_year?.title}</p>
                                            </div>

                                            {/* Stats */}
                                            <div className="p-4 grid grid-cols-2 gap-3">
                                                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                                                    <Users className="w-5 h-5 text-indigo-500 mb-1" />
                                                    <span className="text-lg font-bold text-gray-800">{cls.enrollments_count}</span>
                                                    <span className="text-xs text-gray-500">Students</span>
                                                </div>
                                                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                                                    <Layers className="w-5 h-5 text-emerald-500 mb-1" />
                                                    <span className="text-lg font-bold text-gray-800">{cls.streams?.length ?? 0}</span>
                                                    <span className="text-xs text-gray-500">Streams</span>
                                                </div>
                                            </div>

                                            <div className="px-4 pb-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 group-hover:gap-2.5 transition-all">
                                                    Manage Subjects & Teachers <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
