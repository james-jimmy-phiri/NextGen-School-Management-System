import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Transfers({
    students,
    history,
}: {
    students: { id: number; admission_number: string; first_name: string; last_name: string }[];
    history: { id: number; reason: string; direction: string; effective_on: string; student?: { first_name: string; last_name: string } }[];
}) {
    const { data, setData, post, processing } = useForm({
        student_id: students[0]?.id ?? '',
        reason: '',
        destination: '',
        clearance: { fees: false, library: false, stores: false },
    });

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold">Transfers</h2>}>
            <Head title="Transfers" />
            <div className="grid gap-8 lg:grid-cols-2">
                <form
                    className="space-y-4 rounded-2xl border bg-white p-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('students.transfer'));
                    }}
                >
                    <h3 className="font-semibold">Transfer out</h3>
                    <select className="w-full rounded-lg border px-3 py-2" value={data.student_id} onChange={(e) => setData('student_id', Number(e.target.value))}>
                        {students.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.admission_number} · {s.first_name} {s.last_name}
                            </option>
                        ))}
                    </select>
                    <input className="w-full rounded-lg border px-3 py-2" placeholder="Reason" value={data.reason} onChange={(e) => setData('reason', e.target.value)} required />
                    <input className="w-full rounded-lg border px-3 py-2" placeholder="Destination school (optional)" value={data.destination} onChange={(e) => setData('destination', e.target.value)} />
                    <fieldset className="space-y-2 text-sm">
                        <legend className="font-medium">Clearance</legend>
                        {(['fees', 'library', 'stores'] as const).map((key) => (
                            <label key={key} className="flex items-center gap-2 capitalize">
                                <input
                                    type="checkbox"
                                    checked={data.clearance[key]}
                                    onChange={(e) => setData('clearance', { ...data.clearance, [key]: e.target.checked })}
                                />
                                {key}
                            </label>
                        ))}
                    </fieldset>
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white" disabled={processing}>
                        Record transfer
                    </button>
                </form>
                <div className="rounded-2xl border bg-white p-6">
                    <h3 className="mb-3 font-semibold">Recent transfers</h3>
                    <ul className="space-y-2 text-sm">
                        {history.map((h) => (
                            <li key={h.id} className="border-b pb-2">
                                {h.student?.first_name} {h.student?.last_name} · {h.direction} · {h.reason}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
