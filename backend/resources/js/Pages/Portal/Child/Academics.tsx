import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import PerformanceChart from '@/Components/Portal/PerformanceChart';
import { BookOpen, GraduationCap, TrendingUp, Download } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildAcademics({ student, subjects, history, assessments, summary }: PageProps<{ student: any, subjects: any[], history: any[], assessments: any[], summary: any }>) {
    return (
        <PortalLayout>
            <Head title={`Academics - ${student.first_name}`} />

            <SectionHeader 
                title="Academic Performance" 
                subtitle={summary.term}
                backHref={route('portal.children.show', student.id)}
                icon={BookOpen}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Current Average</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{summary.average}%</p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3" /> +2% from last term
                    </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Class Position</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{summary.position} <span className="text-sm font-normal text-muted-foreground">/ {summary.total_students}</span></p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between items-start">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Report Card</p>
                        <p className="mt-2 text-sm text-foreground">Term 1 Report is ready</p>
                    </div>
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 focus:ring-offset-1">
                        <Download className="h-4 w-4" /> Download PDF
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Subject Performance */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
                    <h3 className="mb-4 font-semibold text-foreground">Subject Breakdown</h3>
                    <PerformanceChart data={subjects} height={250} />
                    
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border text-xs text-muted-foreground">
                                <tr>
                                    <th className="pb-2 font-medium">Subject</th>
                                    <th className="pb-2 font-medium text-right">Score</th>
                                    <th className="pb-2 font-medium text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {subjects.map((sub, idx) => (
                                    <tr key={idx} className="transition-colors hover:bg-muted/30">
                                        <td className="py-2 font-medium text-foreground">{sub.name}</td>
                                        <td className="py-2 text-right font-mono">{sub.score}%</td>
                                        <td className="py-2 text-center">
                                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                                sub.grade === 'A' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                                sub.grade === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                                sub.grade === 'C' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                            }`}>
                                                {sub.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Assessments */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                        <div className="border-b border-border bg-muted/30 px-6 py-4">
                            <h3 className="font-semibold text-foreground">Continuous Assessment</h3>
                        </div>
                        <div className="flex flex-col divide-y divide-border p-0">
                            {assessments.map((a, idx) => (
                                <div key={idx} className="p-4 transition-colors hover:bg-muted/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{a.title}</h4>
                                            <p className="text-xs text-muted-foreground">{a.subject} · {a.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-primary">{a.score} <span className="text-xs font-normal text-muted-foreground">/ {a.max_score}</span></p>
                                            <p className="text-[10px] text-muted-foreground">{format(parseISO(a.date), 'MMM d')}</p>
                                        </div>
                                    </div>
                                    {a.remarks && (
                                        <p className="mt-2 rounded-lg bg-muted p-2 text-xs text-foreground">
                                            <span className="font-semibold text-muted-foreground">Teacher comment:</span> {a.remarks}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
