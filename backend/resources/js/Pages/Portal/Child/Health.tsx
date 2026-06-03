import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import { HeartPulse, Stethoscope, FileWarning, Pill } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildHealth({ student, medicalRecord, clinicVisits }: PageProps<{ student: any, medicalRecord: any, clinicVisits: any[] }>) {
    return (
        <PortalLayout>
            <Head title={`Health - ${student.first_name}`} />

            <SectionHeader 
                title="Health & Medical" 
                subtitle="Medical records and school clinic visits"
                backHref={route('portal.children.show', student.id)}
                icon={HeartPulse}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Medical Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                            <FileWarning className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-foreground">Medical Profile</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Blood Group</p>
                                <p className="font-semibold flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center font-bold">
                                        {medicalRecord?.blood_group || 'N/A'}
                                    </span>
                                </p>
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Allergies</p>
                                {medicalRecord?.allergies ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {medicalRecord.allergies.split(',').map((allergy: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                                {allergy.trim()}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium">None reported</p>
                                )}
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Existing Conditions</p>
                                <p className="text-sm font-medium text-foreground">{medicalRecord?.medical_conditions || 'None reported'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clinic Visits */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden h-full">
                        <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-foreground">School Clinic Visits</h3>
                            </div>
                        </div>
                        <div className="flex flex-col p-6 h-full">
                            {clinicVisits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground min-h-[200px]">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <HeartPulse className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <p>No clinic visits recorded for this academic year.</p>
                                </div>
                            ) : (
                                <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
                                    {clinicVisits.map((visit, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-card border-2 border-primary"></div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <h4 className="font-semibold text-foreground">{visit.condition}</h4>
                                                <span className="text-xs text-muted-foreground">{format(parseISO(visit.date), 'MMM d, yyyy')}</span>
                                            </div>
                                            <div className="mt-2 rounded-lg bg-muted/50 p-4 border border-border">
                                                <div className="flex gap-2">
                                                    <Pill className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Treatment / Action Taken</p>
                                                        <p className="text-sm text-foreground">{visit.action}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
