import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Trash2 } from 'lucide-react';
import type { PageProps } from '@/types';
import { format } from 'date-fns';

export default function Index({ events, flash }: PageProps<{ events: any }>) {
    const rows = events.data ?? events;
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        event_type: 'other',
        start_date: '',
        end_date: '',
        is_holiday: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('calendar-events.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout>
            <Head title="School Calendar" />
            <div className="max-w-4xl mx-auto py-8 grid gap-8 lg:grid-cols-2">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 mb-4"><Calendar className="h-6 w-6 text-primary" /> School calendar</h1>
                    <div className="space-y-2">
                        {rows.map((ev: any) => (
                            <div key={ev.id} className="flex justify-between rounded-xl border bg-card p-3 text-sm">
                                <div>
                                    <p className="font-semibold">{ev.title}</p>
                                    <p className="text-muted-foreground">{format(new Date(ev.start_date), 'dd/MM/yyyy')} · {ev.event_type}</p>
                                </div>
                                <button type="button" onClick={() => router.delete(route('calendar-events.destroy', ev.id))}><Trash2 className="h-4 w-4 text-rose-500" /></button>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={submit} className="rounded-2xl border bg-card p-6 space-y-3 h-fit">
                    <h2 className="font-semibold">Add event</h2>
                    <input placeholder="Title" className="w-full rounded-lg border" value={data.title} onChange={e => setData('title', e.target.value)} required />
                    <textarea placeholder="Description" className="w-full rounded-lg border" value={data.description} onChange={e => setData('description', e.target.value)} />
                    <select className="w-full rounded-lg border" value={data.event_type} onChange={e => setData('event_type', e.target.value)}>
                        <option value="holiday">Holiday</option>
                        <option value="exam">Exam</option>
                        <option value="meeting">Meeting</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="date" className="w-full rounded-lg border" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_holiday} onChange={e => setData('is_holiday', e.target.checked)} /> Public holiday</label>
                    <PrimaryButton disabled={processing}>Add event</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
