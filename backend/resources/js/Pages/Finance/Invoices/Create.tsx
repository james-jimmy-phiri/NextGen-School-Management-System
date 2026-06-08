import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Create({ students, feeStructures }: PageProps<{ students: any[]; feeStructures: any[] }>) {
    const { data, setData, post, processing } = useForm({
        student_id: '',
        fee_structure_id: '',
        due_date: '',
    });

    return (
        <AuthenticatedLayout>
            <Head title="Generate Invoice" />
            <div className="max-w-lg mx-auto py-8">
                <Link href={route('finance.invoices.index')} className="text-sm text-primary hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold mt-4 mb-6">Generate invoice</h1>
                <form onSubmit={e => { e.preventDefault(); post(route('finance.invoices.store')); }} className="space-y-4 rounded-2xl border bg-card p-6">
                    <div>
                        <label className="text-sm font-medium">Student</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.student_id} onChange={e => setData('student_id', e.target.value)} required>
                            <option value="">Select student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Fee structure</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.fee_structure_id} onChange={e => setData('fee_structure_id', e.target.value)} required>
                            <option value="">Select structure</option>
                            {feeStructures.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Due date</label>
                        <input type="date" className="mt-1 w-full rounded-lg border" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                    </div>
                    <PrimaryButton disabled={processing}>Generate</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
