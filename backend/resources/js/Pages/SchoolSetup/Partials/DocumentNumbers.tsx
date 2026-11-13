import React from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

type Sequence = {
    id: number;
    document_type: string;
    prefix: string;
    include_year: boolean;
    padding: number;
    next_number: number;
};

export default function DocumentNumbers({
    sequences,
    printHeader,
    printFooter,
}: {
    sequences: Sequence[];
    printHeader?: string;
    printFooter?: string;
}) {
    const { data, setData, post, processing } = useForm({
        sequences: sequences.map((s) => ({
            id: s.id,
            prefix: s.prefix,
            include_year: s.include_year,
            padding: s.padding,
            next_number: s.next_number,
            document_type: s.document_type,
        })),
        print_header: printHeader ?? '',
        print_footer: printFooter ?? '',
    });

    const updateSeq = (index: number, key: string, value: string | number | boolean) => {
        const next = [...data.sequences];
        next[index] = { ...next[index], [key]: value };
        setData('sequences', next);
    };

    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                post(route('school-setup.document-numbers.update'), {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Numbering saved'),
                });
            }}
        >
            <div>
                <h3 className="text-lg font-bold text-slate-900">Document numbering</h3>
                <p className="text-sm text-slate-500">Admission, invoice and receipt numbers are issued sequentially per school.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Prefix</th>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Padding</th>
                            <th className="px-4 py-3">Next</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.sequences.map((seq, index) => (
                            <tr key={seq.id}>
                                <td className="px-4 py-3 font-medium capitalize">{seq.document_type}</td>
                                <td className="px-4 py-3">
                                    <input className="w-24 rounded-lg border px-2 py-1" value={seq.prefix} onChange={(e) => updateSeq(index, 'prefix', e.target.value)} />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="checkbox" checked={seq.include_year} onChange={(e) => updateSeq(index, 'include_year', e.target.checked)} />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" min={3} max={8} className="w-20 rounded-lg border px-2 py-1" value={seq.padding} onChange={(e) => updateSeq(index, 'padding', Number(e.target.value))} />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" min={1} className="w-24 rounded-lg border px-2 py-1" value={seq.next_number} onChange={(e) => updateSeq(index, 'next_number', Number(e.target.value))} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-600">Print header</label>
                <textarea className="w-full rounded-xl border px-3 py-2" rows={2} value={data.print_header} onChange={(e) => setData('print_header', e.target.value)} />
                <label className="block text-xs font-bold uppercase text-slate-600">Print footer</label>
                <textarea className="w-full rounded-xl border px-3 py-2" rows={2} value={data.print_footer} onChange={(e) => setData('print_footer', e.target.value)} />
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={processing} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    Save numbering
                </button>
            </div>
        </form>
    );
}
