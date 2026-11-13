import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

type ImportRow = Record<string, unknown> & { _line?: number; _valid?: boolean };

export default function StudentImport({
    import: batch,
}: {
    import: {
        id: number;
        original_filename: string;
        status: string;
        rows: ImportRow[];
        errors: { row: number; message: string }[];
        committed_count?: number;
    } | null;
}) {
    const { data, setData, post, processing } = useForm<{ file: File | null }>({ file: null });

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Import students</h2>
                    <p className="text-sm text-slate-500">Upload a CSV, review row errors, then commit. Invalid files are not applied.</p>
                </div>
            }
        >
            <Head title="Import students" />
            <div className="space-y-6">
                <div className="flex gap-3">
                    <a href={route('students.import.template')} className="rounded-lg border px-4 py-2 text-sm font-semibold">
                        Download template
                    </a>
                    <Link href={route('students.index')} className="rounded-lg px-4 py-2 text-sm text-slate-600">
                        Back to list
                    </Link>
                </div>

                <form
                    className="rounded-2xl border bg-white p-6 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('students.import.preview'), { forceFormData: true });
                    }}
                >
                    <input type="file" accept=".csv,text/csv" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white" disabled={processing || !data.file}>
                        Preview
                    </button>
                </form>

                {batch ? (
                    <div className="rounded-2xl border bg-white p-6 space-y-4">
                        <p className="text-sm text-slate-600">
                            File <strong>{batch.original_filename}</strong> · {batch.rows?.length ?? 0} rows · {batch.errors?.length ?? 0} errors · status {batch.status}
                        </p>
                        {(batch.errors ?? []).length > 0 ? (
                            <ul className="text-sm text-red-700 list-disc pl-5">
                                {batch.errors.map((err, i) => (
                                    <li key={i}>
                                        Row {err.row}: {err.message}
                                    </li>
                                ))}
                            </ul>
                        ) : batch.status === 'previewed' ? (
                            <button
                                type="button"
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
                                onClick={() => router.post(route('students.import.commit', batch.id))}
                            >
                                Commit import
                            </button>
                        ) : (
                            <p className="text-sm text-emerald-700">Committed {batch.committed_count ?? 0} students.</p>
                        )}
                    </div>
                ) : null}
            </div>
        </AuthenticatedLayout>
    );
}
