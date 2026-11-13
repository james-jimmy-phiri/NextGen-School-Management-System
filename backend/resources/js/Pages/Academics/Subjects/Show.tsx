import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, Users, UserCog, GraduationCap, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Show({ subject, teacherAllocations }: any) {
    const classCount = subject.class_groups?.length || 0;
    const studentCount = subject.students?.length || 0;
    const teacherCount = teacherAllocations?.length || 0;

    return (
        <AuthenticatedLayout>
            <Head title={`${subject.name} · Subject Overview`} />

            <div className="space-y-6">
                {/* ─── Breadcrumb Navigation ──────────────────────────────────── */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Link href="/dashboard" className="hover:text-foreground">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/academics/subjects" className="hover:text-foreground">Academics</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/academics/subjects" className="hover:text-foreground">Subjects</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">{subject.name}</span>
                </div>

                {/* ─── Hero Subject Banner Card ───────────────────────────────── */}
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/40">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                                    {subject.name}
                                </h1>
                                <span className="rounded-md bg-indigo-100 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    {subject.code}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Standard Academic Curriculum offering &middot; GPA Credit Weight: <span className="font-bold text-slate-800 dark:text-slate-200">{Number(subject.gpa_weight || 1.0).toFixed(1)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-indigo-600">{classCount}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classes</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-emerald-600">{studentCount}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Students</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950/40">
                            <span className="block text-xl font-black text-amber-600">{teacherCount}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teachers</span>
                        </div>
                    </div>
                </div>

                {/* ─── Content Grid ────────────────────────────────────────────── */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Classes Enrolled */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Classes Taught In</h2>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {classCount} Cohorts
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {subject.class_groups?.map((cls: any) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40"
                                >
                                    <div>
                                        <Link
                                            href={route('academics.classes.manage', cls.id)}
                                            className="font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                        >
                                            {cls.name}
                                        </Link>
                                        <p className="mt-0.5 text-xs text-slate-400">{cls.academic_year?.title ?? 'Active Session'}</p>
                                    </div>
                                    <div>
                                        {cls.pivot?.is_core ? (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                Core
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                Elective
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {classCount === 0 && (
                                <p className="py-8 text-center text-xs text-slate-400">This subject is not assigned to any classes yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Teacher Allocations */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <UserCog className="h-5 w-5 text-amber-600" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Assigned Educators</h2>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {teacherCount} Staff
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {teacherAllocations?.map((alloc: any) => (
                                <div
                                    key={alloc.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-black text-amber-600">
                                            {alloc.teacher?.name?.[0] ?? 'T'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{alloc.teacher?.name}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Class: <span className="font-semibold text-slate-600 dark:text-slate-300">{alloc.class_group?.name}</span>
                                                {alloc.stream && <span> &middot; Stream {alloc.stream.name}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                        Active
                                    </span>
                                </div>
                            ))}
                            {teacherCount === 0 && (
                                <p className="py-8 text-center text-xs text-slate-400">No teachers assigned to teach this subject yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
