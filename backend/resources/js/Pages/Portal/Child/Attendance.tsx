import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import StatCard from '@/Components/Portal/StatCard';
import AttendanceHeatmap from '@/Components/Portal/AttendanceHeatmap';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildAttendance({ student, records, summary, currentMonth }: PageProps<{ student: any, records: any[], summary: any, currentMonth: string }>) {
    return (
        <PortalLayout>
            <Head title={`Attendance - ${student.first_name}`} />

            <SectionHeader 
                title="Attendance Records" 
                subtitle="Track daily presence and history"
                backHref={route('portal.children.show', student.id)}
                icon={Clock}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={CheckCircle2} label="Present" value={summary.present} color="green" />
                <StatCard icon={XCircle} label="Absent" value={summary.absent} color="red" />
                <StatCard icon={AlertCircle} label="Late" value={summary.late} color="amber" />
                <StatCard icon={Clock} label="Term Average" value={`${summary.percentage}%`} color={summary.percentage >= 90 ? 'green' : (summary.percentage >= 80 ? 'amber' : 'red')} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <AttendanceHeatmap month={parseISO(currentMonth)} records={records} />
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="border-b border-border bg-muted/30 px-6 py-4">
                        <h3 className="font-semibold text-foreground">Recent History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No records found for this period.</td>
                                    </tr>
                                ) : (
                                    records.slice(0, 10).map((record, idx) => (
                                        <tr key={idx} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">
                                                {format(parseISO(record.date), 'MMM d, yyyy (EEE)')}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    record.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                                    record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                                    record.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-muted-foreground">
                                                {record.remarks || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
