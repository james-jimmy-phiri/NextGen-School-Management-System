import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Create({ classes }: PageProps<{ classes: any[] }>) {
    const { data, setData, post, processing } = useForm({
        title: '',
        body: '',
        target: 'all',
        target_class_id: '',
        publish_at: '',
        expires_at: '',
    });

    return (
        <AuthenticatedLayout>
            <Head title="New Announcement" />
            <div className="max-w-2xl mx-auto py-8">
                <Link href={route('announcements.index')} className="text-sm text-primary hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold mt-4 mb-6">Publish announcement</h1>
                <form onSubmit={e => { e.preventDefault(); post(route('announcements.store')); }} className="space-y-4 rounded-2xl border bg-card p-6">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <input className="mt-1 w-full rounded-lg border" value={data.title} onChange={e => setData('title', e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Message</label>
                        <textarea rows={5} className="mt-1 w-full rounded-lg border" value={data.body} onChange={e => setData('body', e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Audience</label>
                        <select className="mt-1 w-full rounded-lg border" value={data.target} onChange={e => setData('target', e.target.value)}>
                            <option value="all">Everyone</option>
                            <option value="parents">Parents</option>
                            <option value="teachers">Teachers</option>
                            <option value="students">Students</option>
                            <option value="class">Specific class</option>
                        </select>
                    </div>
                    {data.target === 'class' && (
                        <select className="w-full rounded-lg border" value={data.target_class_id} onChange={e => setData('target_class_id', e.target.value)}>
                            <option value="">Select class</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    )}
                    <PrimaryButton disabled={processing}>Publish</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
