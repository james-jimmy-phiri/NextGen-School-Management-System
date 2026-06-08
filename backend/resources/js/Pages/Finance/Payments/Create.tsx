import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Create({ invoices, preselectedInvoiceId }: PageProps<{ invoices: any[]; preselectedInvoiceId?: string }>) {
    const { data, setData, post, processing } = useForm({
        invoice_id: preselectedInvoiceId ?? '',
        amount: '',
        method: 'cash',
        reference: '',
        paid_at: new Date().toISOString().split('T')[0],
    });

    const selected = invoices.find(i => String(i.id) === String(data.invoice_id));

    return (
        <AuthenticatedLayout>
            <Head title="Record Payment" />
            <div className="max-w-lg mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Record payment</h1>
                <form onSubmit={e => { e.preventDefault(); post(route('finance.payments.store')); }} className="space-y-4 rounded-2xl border bg-card p-6">
                    <div>
                        <label className="text-sm font-medium">Invoice</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.invoice_id} onChange={e => setData('invoice_id', e.target.value)} required>
                            <option value="">Select invoice</option>
                            {invoices.map(i => (
                                <option key={i.id} value={i.id}>{i.invoice_number} — {i.student?.first_name} {i.student?.last_name} (MWK {Number(i.balance_due).toLocaleString()} due)</option>
                            ))}
                        </select>
                    </div>
                    {selected && <p className="text-xs text-muted-foreground">Outstanding: MWK {Number(selected.balance_due).toLocaleString()}</p>}
                    <div>
                        <label className="text-sm font-medium">Amount (MWK)</label>
                        <input type="number" step="0.01" className="mt-1 w-full rounded-lg border" value={data.amount} onChange={e => setData('amount', e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Method</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.method} onChange={e => setData('method', e.target.value)}>
                            <option value="cash">Cash</option>
                            <option value="airtel_money">Airtel Money</option>
                            <option value="mpamba">Mpamba</option>
                            <option value="bank_transfer">Bank transfer</option>
                            <option value="cheque">Cheque</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Reference / receipt #</label>
                        <input className="mt-1 w-full rounded-lg border" value={data.reference} onChange={e => setData('reference', e.target.value)} />
                    </div>
                    <PrimaryButton disabled={processing}>Save payment</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
