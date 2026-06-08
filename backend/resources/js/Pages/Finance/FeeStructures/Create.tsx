import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Create({ academicYears }: PageProps<{ academicYears: any[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        academic_year_id: '',
        name: '',
        description: '',
        components: [{ label: 'Tuition', amount: '' }],
        allow_installments: false,
        penalty_percent: '',
        discount_percent: '',
    });

    const addLine = () => setData('components', [...data.components, { label: '', amount: '' }]);
    const updateLine = (i: number, field: string, value: string) => {
        const next = [...data.components];
        next[i] = { ...next[i], [field]: value };
        setData('components', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('finance.fee-structures.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Fee Structure" />
            <div className="max-w-2xl mx-auto py-8">
                <Link href={route('finance.fee-structures.index')} className="text-sm text-primary hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold mt-4 mb-6">New fee structure</h1>
                <form onSubmit={submit} className="space-y-6 rounded-2xl border bg-card p-6">
                    <div>
                        <label className="text-sm font-medium">Academic year</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} required>
                            <option value="">Select year</option>
                            {academicYears.map(y => <option key={y.id} value={y.id}>{y.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input className="mt-1 w-full rounded-lg border" value={data.name} onChange={e => setData('name', e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Fee components</label>
                        {data.components.map((c, i) => (
                            <div key={i} className="mt-2 flex gap-2">
                                <input placeholder="Label" className="flex-1 rounded-lg border" value={c.label} onChange={e => updateLine(i, 'label', e.target.value)} />
                                <input placeholder="Amount (MWK)" type="number" className="w-32 rounded-lg border" value={c.amount} onChange={e => updateLine(i, 'amount', e.target.value)} />
                            </div>
                        ))}
                        <button type="button" onClick={addLine} className="mt-2 text-sm text-primary">+ Add line</button>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.allow_installments} onChange={e => setData('allow_installments', e.target.checked)} />
                        Allow installment payments
                    </label>
                    <PrimaryButton disabled={processing}>Save structure</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
