import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, useForm } from '@inertiajs/react';
import type { PageProps } from '@/types';

const STATUSES = ['present', 'absent', 'late', 'excused'] as const;

export default function Mark({ classes, students, existing, filters, flash }: PageProps<{ classes: any[]; students: any[]; existing: Record<string, any>; filters: any }>) {
    const initialRecords = students.map(s => ({
        student_id: s.id,
        status: existing[s.id]?.status ?? 'present',
        notes: existing[s.id]?.notes ?? '',
    }));

    const { data, setData, post, processing } = useForm({
        class_group_id: filters.class_group_id ?? '',
        date: filters.date ?? new Date().toISOString().split('T')[0],
        records: initialRecords,
    });

    useEffect(() => {
        setData('records', students.map(s => ({
            student_id: s.id,
            status: existing[s.id]?.status ?? 'present',
            notes: existing[s.id]?.notes ?? '',
        })));
        setData('class_group_id', filters.class_group_id ?? '');
    }, [students, filters.class_group_id]);

    const loadClass = (classId: string) => {
        router.get(route('attendance.mark'), { class_group_id: classId, date: data.date }, { preserveState: false });
    };

    const updateRecord = (index: number, field: string, value: string) => {
        const next = [...data.records];
        next[index] = { ...next[index], [field]: value };
        setData('records', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('attendance.sessions.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mark Attendance" />
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-2">Mark class attendance</h1>
                <p className="text-sm text-muted-foreground mb-6">FR-013: Manual roll call per class and date.</p>
                {flash?.success && <div className="mb-4 rounded-lg bg-emerald-50 text-emerald-800 p-3 text-sm">{flash.success}</div>}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select className="rounded-lg border" value={data.class_group_id} onChange={e => loadClass(e.target.value)}>
                        <option value="">Select class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="date" className="rounded-lg border" value={data.date} onChange={e => router.get(route('attendance.mark'), { class_group_id: data.class_group_id, date: e.target.value })} />
                </div>
                {students.length > 0 && (
                    <form onSubmit={submit} className="rounded-2xl border bg-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase"><tr><th className="px-4 py-2 text-left">Student</th><th className="px-4 py-2 text-left">Status</th></tr></thead>
                            <tbody className="divide-y">
                                {students.map((s, i) => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-2">{s.first_name} {s.last_name} <span className="text-muted-foreground text-xs">({s.admission_number})</span></td>
                                        <td className="px-4 py-2">
                                            <select className="rounded border text-sm" value={data.records[i]?.status} onChange={e => updateRecord(i, 'status', e.target.value)}>
                                                {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 border-t"><PrimaryButton disabled={processing}>Save attendance</PrimaryButton></div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
