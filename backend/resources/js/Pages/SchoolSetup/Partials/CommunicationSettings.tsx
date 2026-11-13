import React from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function CommunicationSettings({ settings }: { settings?: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({
        sender_name: settings?.sender_name ?? '',
        default_channel: settings?.default_channel ?? 'sms',
        quiet_hours_start: settings?.quiet_hours_start ?? '20:00',
        quiet_hours_end: settings?.quiet_hours_end ?? '06:00',
    });

    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                post(route('school-setup.communication.update'), {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Communication preferences saved'),
                });
            }}
        >
            <div>
                <h3 className="text-lg font-bold text-slate-900">Communication preferences</h3>
                <p className="text-sm text-slate-500">Used when SMS, email and push are connected in later phases. Quiet hours are stored now so notices can respect them later.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                    Sender name
                    <input className="mt-1 w-full rounded-xl border px-3 py-2" value={data.sender_name} onChange={(e) => setData('sender_name', e.target.value)} />
                </label>
                <label className="space-y-1 text-sm">
                    Default channel
                    <select className="mt-1 w-full rounded-xl border px-3 py-2" value={data.default_channel} onChange={(e) => setData('default_channel', e.target.value)}>
                        <option value="sms">SMS</option>
                        <option value="email">Email</option>
                        <option value="push">Push</option>
                    </select>
                </label>
                <label className="space-y-1 text-sm">
                    Quiet hours start
                    <input type="time" className="mt-1 w-full rounded-xl border px-3 py-2" value={data.quiet_hours_start} onChange={(e) => setData('quiet_hours_start', e.target.value)} />
                </label>
                <label className="space-y-1 text-sm">
                    Quiet hours end
                    <input type="time" className="mt-1 w-full rounded-xl border px-3 py-2" value={data.quiet_hours_end} onChange={(e) => setData('quiet_hours_end', e.target.value)} />
                </label>
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={processing} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    Save preferences
                </button>
            </div>
        </form>
    );
}
