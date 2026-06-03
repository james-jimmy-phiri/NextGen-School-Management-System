import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import { Megaphone, ShieldAlert, CalendarClock } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function PortalAnnouncements({ announcements }: PageProps<{ announcements: any[] }>) {
    return (
        <PortalLayout>
            <Head title="Announcements" />

            <SectionHeader 
                title="School Announcements" 
                subtitle="Important updates and notices from the school administration"
                icon={Megaphone}
            />

            <div className="flex flex-col gap-6 max-w-4xl">
                {announcements.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Megaphone className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Announcements</h3>
                        <p className="max-w-md text-sm">There are currently no active announcements from the school.</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <article key={announcement.id} className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-md">
                            <div className="bg-primary/5 p-6 sm:w-48 shrink-0 flex flex-col sm:border-r border-border">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                                    <ShieldAlert className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Published</span>
                                <span className="font-medium text-foreground">{format(parseISO(announcement.publish_at), 'MMM d, yyyy')}</span>
                                {announcement.expires_at && (
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <CalendarClock className="w-3 h-3" /> Valid Until
                                        </span>
                                        <span className="text-sm text-muted-foreground">{format(parseISO(announcement.expires_at), 'MMM d, yyyy')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-foreground mb-4">{announcement.title}</h3>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                    {announcement.body}
                                </div>
                                <div className="mt-auto pt-6 flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                                        {announcement.author?.name?.charAt(0) || 'A'}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Posted by {announcement.author?.name || 'Administration'}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </PortalLayout>
    );
}
