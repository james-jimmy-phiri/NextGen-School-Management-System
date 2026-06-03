import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import { Calendar, Clock, MapPin, UserSquare2 } from 'lucide-react';
import type { PageProps } from '@/types';

export default function ChildTimetable({ student, days, periods, schedule }: PageProps<{ student: any, days: string[], periods: any[], schedule: any }>) {
    // Basic day switcher for mobile
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const initialDayIndex = today >= 1 && today <= 5 ? today - 1 : 0;
    
    return (
        <PortalLayout>
            <Head title={`Timetable - ${student.first_name}`} />

            <SectionHeader 
                title="Class Timetable" 
                subtitle="Weekly lesson schedule"
                backHref={route('portal.children.show', student.id)}
                icon={Calendar}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="w-24 border-b border-r border-border bg-muted/50 p-4 text-center font-semibold text-muted-foreground">Time</th>
                                {days.map(day => (
                                    <th key={day} className="border-b border-border bg-muted/30 p-4 text-center font-semibold text-foreground">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {periods.map((period, pIdx) => (
                                <tr key={period.id} className="group transition-colors hover:bg-muted/10">
                                    <td className="border-b border-r border-border bg-muted/20 p-3 text-center align-middle">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className="text-xs font-medium text-foreground whitespace-nowrap">{period.time.split(' - ')[0]}</span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{period.time.split(' - ')[1]}</span>
                                        </div>
                                    </td>
                                    
                                    {period.is_break ? (
                                        <td colSpan={5} className="border-b border-border bg-muted/40 p-3 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-semibold uppercase tracking-widest text-xs">{period.name}</span>
                                            </div>
                                        </td>
                                    ) : (
                                        days.map(day => {
                                            const lesson = schedule[day]?.[period.id];
                                            return (
                                                <td key={`${day}-${period.id}`} className="border-b border-r border-border p-2 align-top last:border-r-0">
                                                    {lesson ? (
                                                        <div className="flex h-full min-h-[90px] flex-col rounded-xl border border-transparent bg-primary/5 p-3 transition-colors group-hover:border-primary/10 group-hover:bg-primary/10">
                                                            <span className="font-semibold text-primary">{lesson.subject}</span>
                                                            <div className="mt-auto pt-2 flex flex-col gap-1 text-[10px] text-muted-foreground">
                                                                <span className="flex items-center gap-1"><UserSquare2 className="w-3 h-3 shrink-0" /> {lesson.teacher}</span>
                                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" /> {lesson.room}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full min-h-[90px] items-center justify-center rounded-xl bg-muted/20 border border-dashed border-border/50">
                                                            <span className="text-xs text-muted-foreground">Free Period</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PortalLayout>
    );
}
