import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import { MessageCircle, Send, Plus, User, Clock } from 'lucide-react';
import type { PageProps, AuthUser } from '@/types';
import { format, parseISO } from 'date-fns';
import { Dialog } from '@headlessui/react';

export default function PortalMessages({ auth, messages, contacts }: PageProps<{ messages: any[], contacts: any[] }>) {
    const user = auth.user as AuthUser;
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        to_user_id: '',
        subject: '',
        body: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('portal.messages.store'), {
            onSuccess: () => {
                reset();
                setIsNewMessageOpen(false);
            },
        });
    };

    return (
        <PortalLayout>
            <Head title="Messages" />

            <SectionHeader 
                title="Messages" 
                subtitle="Communicate with teachers and administration"
                icon={MessageCircle}
                actions={
                    <button 
                        onClick={() => setIsNewMessageOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Message
                    </button>
                }
            />

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-[600px]">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Messages</h3>
                        <p className="max-w-md text-sm">You haven't received or sent any messages yet. Click "New Message" to contact school staff.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="flex flex-col divide-y divide-border">
                            {messages.map((message) => (
                                <div key={message.id} className={`p-6 transition-colors hover:bg-muted/10 ${!message.read_at && !message.is_sender ? 'bg-primary/5' : ''}`}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <User className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-semibold ${!message.read_at && !message.is_sender ? 'text-foreground' : 'text-foreground/90'}`}>
                                                    {message.is_sender ? `To: ${message.recipient.name}` : `From: ${message.sender.name}`}
                                                </h4>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {format(parseISO(message.created_at), 'MMM d, h:mm a')}
                                                </span>
                                            </div>
                                            <h5 className="text-sm font-bold text-foreground mb-2">{message.subject}</h5>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message.body}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            <Dialog open={isNewMessageOpen} onClose={() => setIsNewMessageOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-lg w-full rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border">
                        <Dialog.Title className="text-lg font-bold text-foreground mb-4">Compose Message</Dialog.Title>
                        
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">To</label>
                                <select 
                                    className="w-full rounded-xl border-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    value={data.to_user_id}
                                    onChange={e => setData('to_user_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select recipient...</option>
                                    {contacts.map(contact => (
                                        <option key={contact.id} value={contact.id}>{contact.name} ({contact.role})</option>
                                    ))}
                                </select>
                                {errors.to_user_id && <p className="mt-1 text-xs text-red-600">{errors.to_user_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    className="w-full rounded-xl border-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    required
                                />
                                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                                <textarea 
                                    rows={5}
                                    className="w-full rounded-xl border-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    required
                                />
                                {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsNewMessageOpen(false)}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
                                >
                                    <Send className="w-4 h-4" /> Send Message
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </PortalLayout>
    );
}
