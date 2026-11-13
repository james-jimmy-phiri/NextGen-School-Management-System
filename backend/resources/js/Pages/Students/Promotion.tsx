import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

type Learner = {
    id: number;
    admission_number: string;
    name: string;
    class: string | null;
    outstanding_balance: number;
};

export default function Promotion({
    students,
    classGroups,
}: {
    students: Learner[];
    classGroups: { id: number; name: string }[];
}) {
    const [selected, setSelected] = useState<number[]>([]);
    const { data, setData, post, processing } = useForm({
        student_ids: [] as number[],
        to_class_group_id: classGroups[0]?.id ?? '',
        repeat_ids: [] as number[],
    });

    const toggle = (id: number) => {
        const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
        setSelected(next);
        setData('student_ids', next);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold">Student promotion</h2>}>
            <Head title="Promotion" />
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route('students.promote'));
                }}
            >
                <div className="flex flex-wrap items-end gap-4">
                    <label className="text-sm">
                        Destination class
                        <select
                            className="mt-1 block rounded-lg border px-3 py-2"
                            value={data.to_class_group_id}
                            onChange={(e) => setData('to_class_group_id', Number(e.target.value))}
                        >
                            {classGroups.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white" disabled={processing || selected.length === 0}>
                        Promote selected
                    </button>
                </div>
                <div className="overflow-hidden rounded-2xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3"></th>
                                <th className="px-4 py-3">Admission</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Class</th>
                                <th className="px-4 py-3">Fee balance</th>
                                <th className="px-4 py-3">Repeat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students.map((s) => (
                                <tr key={s.id} className={s.outstanding_balance > 0 ? 'bg-amber-50' : ''}>
                                    <td className="px-4 py-2">
                                        <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs">{s.admission_number}</td>
                                    <td className="px-4 py-2">{s.name}</td>
                                    <td className="px-4 py-2">{s.class ?? '—'}</td>
                                    <td className="px-4 py-2">{s.outstanding_balance > 0 ? `MWK ${s.outstanding_balance}` : 'Clear'}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={data.repeat_ids.includes(s.id)}
                                            onChange={(e) => {
                                                const next = e.target.checked
                                                    ? [...data.repeat_ids, s.id]
                                                    : data.repeat_ids.filter((id) => id !== s.id);
                                                setData('repeat_ids', next);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
