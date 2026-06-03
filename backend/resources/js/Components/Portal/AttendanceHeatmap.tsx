import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';

interface AttendanceRecord {
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
}

interface AttendanceHeatmapProps {
    month: Date;
    records: AttendanceRecord[];
    className?: string;
}

export default function AttendanceHeatmap({ month, records, className }: AttendanceHeatmapProps) {
    const daysInMonth = useMemo(() => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        return eachDayOfInterval({ start, end });
    }, [month]);

    const getStatusForDay = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return records.find((r) => r.date === dateStr)?.status;
    };

    const statusColors = {
        present: 'bg-emerald-500 hover:bg-emerald-600',
        absent: 'bg-red-500 hover:bg-red-600',
        late: 'bg-amber-500 hover:bg-amber-600',
        excused: 'bg-blue-500 hover:bg-blue-600',
        default: 'bg-muted hover:bg-muted-foreground/20',
    };

    // Pad beginning of month
    const startDay = getDay(startOfMonth(month));
    const padding = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => (
        <div key={`pad-${i}`} className="h-10 w-full rounded-md bg-transparent" />
    ));

    return (
        <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{format(month, 'MMMM yyyy')}</h3>
                <div className="flex gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Present</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Absent</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Late</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                    <div key={d} className="py-2 font-medium">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mt-1">
                {padding}
                {daysInMonth.map((day) => {
                    const status = getStatusForDay(day);
                    const colorClass = status ? statusColors[status] : statusColors.default;
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                "flex h-10 w-full items-center justify-center rounded-md text-sm transition-colors",
                                colorClass,
                                status ? "text-white shadow-sm" : "text-muted-foreground",
                                isToday && !status && "border border-primary text-primary"
                            )}
                            title={`${format(day, 'MMM d')}${status ? ` - ${status}` : ''}`}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
