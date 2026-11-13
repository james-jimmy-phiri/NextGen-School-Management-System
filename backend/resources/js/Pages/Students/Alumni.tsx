import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Alumni({ students }: { students: { data: { id: number; admission_number: string; first_name: string; last_name: string; left_on: string | null }[] } }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold">Alumni</h2>}>
            <Head title="Alumni" />
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Admission</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Left on</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {(students.data ?? []).map((s) => (
                            <tr key={s.id}>
                                <td className="px-4 py-3 font-mono text-xs">{s.admission_number}</td>
                                <td className="px-4 py-3">
                                    {s.first_name} {s.last_name}
                                </td>
                                <td className="px-4 py-3">{s.left_on ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
