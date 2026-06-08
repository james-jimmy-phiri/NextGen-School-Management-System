import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Edit({ assessment, students, marks }: PageProps<{ assessment: any; students: any[]; marks: Record<string, any> }>) {
    const { data, setData, patch, processing } = useForm({
        marks: students.map(s => ({
            student_id: s.id,
            score: marks[s.id]?.score ?? '',
            comment: marks[s.id]?.comment ?? '',
        })),
    });

    const update = (i: number, field: string, value: string) => {
        const next = [...data.marks];
        next[i] = { ...next[i], [field]: value };
        setData('marks', next);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Marks: ${assessment.title}`} />
            <div className="max-w-3xl mx-auto py-8">
                <Link href={route('academics.marks.index')} className="text-sm text-primary hover:underline">← Assessments</Link>
                <h1 className="text-xl font-bold mt-4">{assessment.title}</h1>
                <p className="text-sm text-muted-foreground mb-6">{assessment.subject?.name} · Max score: {assessment.max_score}</p>
                <form onSubmit={e => { e.preventDefault(); patch(route('academics.marks.update', assessment.id)); }} className="rounded-2xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left">Student</th><th className="px-4 py-2 text-left">Score</th></tr></thead>
                        <tbody className="divide-y">
                            {students.map((s, i) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2">{s.first_name} {s.last_name}</td>
                                    <td className="px-4 py-2">
                                        <input type="number" min={0} max={assessment.max_score} className="w-24 rounded border" value={data.marks[i]?.score} onChange={e => update(i, 'score', e.target.value)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t"><PrimaryButton disabled={processing}>Save marks</PrimaryButton></div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
