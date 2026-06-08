import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
import type { PageProps } from '@/types';
import { format } from 'date-fns';

export default function Index({ announcements, flash }: PageProps<{ announcements: any }>) {
    const rows = announcements.data ?? announcements;

    return (
        <AuthenticatedLayout>
            <Head title="Announcements" />
            <div className="max-w-4xl mx-auto py-8">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Megaphone className="h-6 w-6 text-primary" /> Announcements</h1>
                    <Link href={route('announcements.create')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        <Plus className="h-4 w-4" /> New
                    </Link>
                </div>
                {flash?.success && <div className="mb-4 rounded-lg bg-emerald-50 text-emerald-800 p-3 text-sm">{flash.success}</div>}
                <div className="space-y-3">
                    {rows.map((a: any) => (
                        <div key={a.id} className="rounded-xl border bg-card p-4 flex justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">{a.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.body}</p>
                                <p className="text-xs text-muted-foreground mt-2">{a.author?.name} · {format(new Date(a.created_at), 'dd/MM/yyyy')}</p>
                            </div>
                            <button type="button" onClick={() => confirm('Delete?') && router.delete(route('announcements.destroy', a.id))} className="text-rose-500 hover:text-rose-700">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
