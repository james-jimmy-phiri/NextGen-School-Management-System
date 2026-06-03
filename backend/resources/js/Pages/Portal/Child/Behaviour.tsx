import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import StatCard from '@/Components/Portal/StatCard';
import { Activity, ShieldAlert, Award, AlertTriangle, MessageCircleWarning } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildBehaviour({ student, records, awards, summary }: PageProps<{ student: any, records: any[], awards: any[], summary: any }>) {
    return (
        <PortalLayout>
            <Head title={`Behaviour - ${student.first_name}`} />

            <SectionHeader 
                title="Behaviour & Discipline" 
                subtitle="Track conduct, incidents, and awards"
                backHref={route('portal.children.show', student.id)}
                icon={Activity}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <StatCard 
                    icon={Activity} 
                    label="Behaviour Score" 
                    value={`${summary.points} / 100`} 
                    color={summary.points >= 90 ? 'green' : (summary.points >= 75 ? 'amber' : 'red')} 
                    sub="Current academic year"
                />
                <StatCard 
                    icon={AlertTriangle} 
                    label="Recorded Incidents" 
                    value={summary.incidents} 
                    color={summary.incidents === 0 ? 'green' : 'amber'} 
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Discipline Records */}
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Discipline Log</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Official Records</span>
                    </div>
                    <div className="flex flex-col divide-y divide-border p-0">
                        {records.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center text-muted-foreground">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 mb-3 flex items-center justify-center">
                                    <Award className="w-6 h-6" />
                                </div>
                                <p>No discipline issues recorded.</p>
                                <p className="text-xs">Excellent conduct!</p>
                            </div>
                        ) : (
                            records.map((record, idx) => (
                                <div key={idx} className="p-5 transition-colors hover:bg-muted/20">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                record.severity === 'high' ? 'bg-red-100 text-red-600' : 
                                                (record.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600')
                                            }`}>
                                                <MessageCircleWarning className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{record.incident_type}</h4>
                                                <p className="text-xs text-muted-foreground">{format(parseISO(record.date), 'MMMM d, yyyy')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-inset ring-red-500/10">
                                                -{record.points_deducted} pts
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pl-11 space-y-2">
                                        <p className="text-sm text-foreground">{record.description}</p>
                                        <div className="rounded-lg bg-muted p-3 text-xs border border-border">
                                            <span className="font-semibold text-foreground block mb-1">Action Taken:</span>
                                            <span className="text-muted-foreground">{record.action_taken}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Positive Awards */}
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">Achievements & Awards</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> Recognitions</span>
                    </div>
                    <div className="flex flex-col divide-y divide-border p-0">
                        {awards.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No awards recorded yet.</div>
                        ) : (
                            awards.map((award, idx) => (
                                <div key={idx} className="p-4 transition-colors hover:bg-muted/20 flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{award.title}</h4>
                                        <p className="text-sm text-muted-foreground">{award.category} · {format(parseISO(award.date), 'MMM yyyy')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
