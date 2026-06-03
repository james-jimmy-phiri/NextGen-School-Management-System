import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import { Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO, isSameDay } from 'date-fns';

export default function PortalCalendar({ events }: PageProps<{ events: any[] }>) {
    // Group events by month
    const groupedEvents = events.reduce((acc, event) => {
        const date = parseISO(event.start_date);
        const monthYear = format(date, 'MMMM yyyy');
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(event);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <PortalLayout>
            <Head title="School Calendar" />

            <SectionHeader 
                title="School Calendar" 
                subtitle="Term dates, exams, and holidays"
                icon={CalendarIcon}
            />

            <div className="flex flex-col gap-8 max-w-4xl">
                {Object.keys(groupedEvents).length === 0 ? (
                    <div className="rounded-3xl border border-border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Upcoming Events</h3>
                        <p className="max-w-md text-sm">The school calendar has not been populated with upcoming events yet.</p>
                    </div>
                ) : (
                    (Object.entries(groupedEvents) as [string, any[]][]).map(([month, monthEvents]) => (
                        <div key={month} className="flex flex-col">
                            <h3 className="text-lg font-bold text-foreground mb-4 sticky top-16 bg-muted/30 py-2 backdrop-blur-sm z-10 pl-2 border-l-4 border-primary">
                                {month}
                            </h3>
                            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col divide-y divide-border">
                                {monthEvents.map((event) => {
                                    const startDate = parseISO(event.start_date);
                                    const endDate = event.end_date ? parseISO(event.end_date) : null;
                                    const isMultiDay = endDate && !isSameDay(startDate, endDate);

                                    return (
                                        <div key={event.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-muted/10 transition-colors">
                                            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-2xl p-3 sm:w-24 shrink-0 text-center border border-border">
                                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                                    {format(startDate, 'EEE')}
                                                </span>
                                                <span className={`text-2xl font-bold leading-none ${event.is_holiday ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                                    {format(startDate, 'd')}
                                                </span>
                                                {isMultiDay && (
                                                    <>
                                                        <span className="text-[10px] text-muted-foreground my-1">to</span>
                                                        <span className="text-lg font-bold leading-none text-muted-foreground">
                                                            {format(endDate, 'd')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h4 className="text-lg font-bold text-foreground">{event.title}</h4>
                                                    <span className={`shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                                                        event.is_holiday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                                        event.event_type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                    }`}>
                                                        {event.is_holiday ? 'Holiday' : event.event_type}
                                                    </span>
                                                </div>
                                                {event.description && (
                                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                                )}
                                                {isMultiDay && (
                                                    <p className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                        <CalendarIcon className="w-3.5 h-3.5" /> 
                                                        Ends {format(endDate, 'MMMM d, yyyy')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PortalLayout>
    );
}
