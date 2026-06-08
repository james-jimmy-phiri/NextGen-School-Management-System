import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Index({ assessments }: PageProps<{ assessments: any }>) {
    const rows = assessments.data ?? assessments;

    return (
        <AuthenticatedLayout>
            <Head title="Marks Entry" />
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-2">Marks entry</h1>
                <p className="text-sm text-muted-foreground mb-6">FR-016: Enter scores per assessment.</p>
                <div className="rounded-2xl border bg-card divide-y">
                    {rows.map((a: any) => (
                        <Link key={a.id} href={route('academics.marks.edit', a.id)} className="flex justify-between px-4 py-3 hover:bg-muted/30">
                            <div>
                                <p className="font-medium">{a.title}</p>
                                <p className="text-xs text-muted-foreground">{a.subject?.name} · {a.class_group?.name} · Max {a.max_score}</p>
                            </div>
                            <span className="text-sm text-primary">Enter marks →</span>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
