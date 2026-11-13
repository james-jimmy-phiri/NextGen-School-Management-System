import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import {
    BookOpen,
    Users,
    UserCog,
    GraduationCap,
    Trash2,
    PlusCircle,
    Check,
    ChevronRight,
    Layers,
    Shield,
} from 'lucide-react';

export default function Show({ classGroup, allSubjects, teachers, teacherAllocations }: any) {
    const [activeTab, setActiveTab] = useState('subjects');

    // 1. Subjects Form
    const currentSubjectIds = classGroup.subjects?.map((s: any) => s.id) || [];
    const { data: subjectData, setData: setSubjectData, post: postSubjects, processing: processingSubjects } = useForm({
        subject_ids: currentSubjectIds,
    });

    const handleSubjectToggle = (id: number) => {
        const newIds = subjectData.subject_ids.includes(id)
            ? subjectData.subject_ids.filter((sid: number) => sid !== id)
            : [...subjectData.subject_ids, id];
        setSubjectData('subject_ids', newIds);
    };

    const submitSubjects = (e: React.FormEvent) => {
        e.preventDefault();
        postSubjects(route('academics.classes.subjects.assign', classGroup.id));
    };

    // 2. Teacher Allocation Form
    const { data: allocData, setData: setAllocData, post: postAlloc, processing: processingAlloc, reset: resetAlloc, errors: allocErrors } = useForm({
        subject_id: '',
        stream_id: '',
        teacher_id: '',
    });

    const submitAllocation = (e: React.FormEvent) => {
        e.preventDefault();
        postAlloc(route('academics.classes.teachers.assign', classGroup.id), {
            onSuccess: () => resetAlloc('teacher_id'),
        });
    };

    const removeAllocation = (id: number) => {
        if (confirm('Are you sure you want to remove this teacher allocation?')) {
            router.delete(route('academics.allocations.destroy', id));
        }
    };

    const tabs = [
        { id: 'subjects', label: 'Class Subjects', count: classGroup.subjects?.length || 0, icon: BookOpen },
        { id: 'teachers', label: 'Subject Teachers', count: teacherAllocations?.length || 0, icon: UserCog },
        { id: 'students', label: 'Student Enrollments', count: classGroup.enrollments?.length || 0, icon: GraduationCap },
        { id: 'streams', label: 'Streams & Sections', count: classGroup.streams?.length || 0, icon: Layers },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`${classGroup.name} · Academic Management`} />

            <div className="space-y-6">
                {/* ─── Breadcrumb Navigation ──────────────────────────────────── */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Link href="/dashboard" className="hover:text-foreground">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/academics/classes" className="hover:text-foreground">Academics</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/academics/classes" className="hover:text-foreground">Classes</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">{classGroup.name}</span>
                </div>

                {/* ─── Header Summary Card ────────────────────────────────────── */}
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/40">
                            <Layers className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                                    {classGroup.name}
                                </h1>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    Active Cohort
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {classGroup.academic_year?.title ?? '2026 Academic Session'} &middot; Grade Level: <span className="font-semibold text-slate-700 dark:text-slate-300">{classGroup.grade_level?.label ?? 'Form'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-indigo-600">{classGroup.enrollments?.length || 0}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Learners</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-emerald-600">{classGroup.subjects?.length || 0}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subjects</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-amber-600">{classGroup.streams?.length || 0}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Streams</span>
                        </div>
                    </div>
                </div>

                {/* ─── Navigation Tabs ────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold dark:border-slate-800">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ─── Tab Contents ───────────────────────────────────────────── */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {/* 1. Subjects Tab */}
                    {activeTab === 'subjects' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Class Subjects</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Select the subjects offered in {classGroup.name}. All enrolled learners automatically register for these courses.
                                </p>
                            </div>

                            <form onSubmit={submitSubjects} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {allSubjects.map((subject: any) => {
                                        const isSelected = subjectData.subject_ids.includes(subject.id);
                                        return (
                                            <div
                                                key={subject.id}
                                                onClick={() => handleSubjectToggle(subject.id)}
                                                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                                                    isSelected
                                                        ? 'border-indigo-500 bg-indigo-50/70 shadow-sm dark:border-indigo-600 dark:bg-indigo-950/30'
                                                        : 'border-slate-200 hover:border-indigo-300 dark:border-slate-800'
                                                }`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-bold ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                                                        {subject.name}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-xs text-slate-400">{subject.code}</p>
                                                </div>
                                                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                                                }`}>
                                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <PrimaryButton disabled={processingSubjects}>
                                        {processingSubjects ? 'Saving Configurations...' : 'Save Subject Configuration'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 2. Teachers Tab */}
                    {activeTab === 'teachers' && (
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/30">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Allocate Teacher</h3>
                                <p className="mt-1 text-xs text-slate-500">Assign faculty members to specific subjects or streams.</p>

                                <form onSubmit={submitAllocation} className="mt-4 space-y-4">
                                    <div>
                                        <InputLabel value="Subject *" />
                                        <select
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                            value={allocData.subject_id}
                                            onChange={(e) => setAllocData('subject_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select subject...</option>
                                            {classGroup.subjects?.map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={allocErrors.subject_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Stream / Section" />
                                        <select
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                            value={allocData.stream_id}
                                            onChange={(e) => setAllocData('stream_id', e.target.value)}
                                        >
                                            <option value="">All Streams (Cohort-wide)</option>
                                            {classGroup.streams?.map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel value="Educator *" />
                                        <select
                                            className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                            value={allocData.teacher_id}
                                            onChange={(e) => setAllocData('teacher_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select educator...</option>
                                            {teachers.map((t: any) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={allocErrors.teacher_id} className="mt-2" />
                                    </div>

                                    <PrimaryButton type="submit" disabled={processingAlloc} className="w-full justify-center">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Save Allocation
                                    </PrimaryButton>
                                </form>
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Allocations</h3>
                                <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                                    <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
                                        <thead className="bg-slate-50/70 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950/50">
                                            <tr>
                                                <th className="px-5 py-3">Subject</th>
                                                <th className="px-5 py-3">Stream</th>
                                                <th className="px-5 py-3">Teacher</th>
                                                <th className="px-5 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {teacherAllocations.map((alloc: any) => (
                                                <tr key={alloc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                                        {alloc.subject?.name}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-slate-500">
                                                        {alloc.stream ? alloc.stream.name : <span className="italic text-slate-400">All streams</span>}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {alloc.teacher?.name}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <button
                                                            onClick={() => removeAllocation(alloc.id)}
                                                            className="text-rose-500 hover:text-rose-700"
                                                            title="Remove allocation"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {teacherAllocations.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                                                        No teachers allocated to subjects yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Students Tab */}
                    {activeTab === 'students' && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Enrolled Learners</h3>
                                <p className="text-xs text-slate-400">All students registered under this academic cohort.</p>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                                <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
                                    <thead className="bg-slate-50/70 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950/50">
                                        <tr>
                                            <th className="px-6 py-3.5">Learner Profile</th>
                                            <th className="px-6 py-3.5">Admission Number</th>
                                            <th className="px-6 py-3.5">Stream</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {classGroup.enrollments?.map((enrollment: any) => (
                                            <tr key={enrollment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600">
                                                            {enrollment.student?.first_name?.[0]}
                                                            {enrollment.student?.last_name?.[0]}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {enrollment.student?.first_name} {enrollment.student?.last_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                    {enrollment.student?.admission_number}
                                                </td>
                                                <td className="px-6 py-3.5 text-xs text-slate-500">
                                                    {enrollment.stream ? enrollment.stream.name : 'Standard Stream'}
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <Link
                                                        href={route('students.show', enrollment.student?.id ?? 0)}
                                                        className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                                    >
                                                        Profile &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!classGroup.enrollments || classGroup.enrollments.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                                                    No students enrolled in this cohort yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 4. Streams Tab */}
                    {activeTab === 'streams' && (
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Cohort Streams & Classrooms</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {classGroup.streams?.map((stream: any) => (
                                    <div
                                        key={stream.id}
                                        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-base font-black text-slate-900 dark:text-white">{stream.name}</h4>
                                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                                                Active Stream
                                            </span>
                                        </div>
                                        <div className="mt-4 space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Assigned Room:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{stream.classroom || 'Main Block'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Target Capacity:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{stream.capacity || '45 Seats'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!classGroup.streams || classGroup.streams.length === 0) && (
                                    <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400">
                                        No specific streams configured for this class.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
