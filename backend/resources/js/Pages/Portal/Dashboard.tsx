import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Clock, Wallet, ShieldAlert, Award, Calendar, ChevronRight } from 'lucide-react';
import type { PageProps } from '@/types';
import StatCard from '@/Components/Portal/StatCard';
import { format } from 'date-fns';

export default function Dashboard({ auth, students, announcements, events }: PageProps<{ students: any[], announcements: any[], events: any[] }>) {
    return (
        <PortalLayout
            header={
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Welcome back, {auth.user?.name?.split(' ')[0] ?? 'Parent'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Here's what's happening with your children's education today.
                    </p>
                </div>
            }
        >
            <Head title="Parent Dashboard" />

            <div className="flex flex-col gap-8">
                {/* Children Overview */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">My Children</h2>
                    </div>
                    
                    {students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-foreground">No Children Linked</h3>
                            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                                Please contact the school administration to link your profile to your children's records.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {students.map((student, idx) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4 border-b border-border p-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
                                            {student.photo_path ? (
                                                <img src={`/storage/${student.photo_path}`} alt={student.first_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold uppercase">{student.first_name[0]}{student.last_name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <h3 className="text-lg font-bold text-foreground">{student.first_name} {student.last_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {student.enrollments?.[0]?.class_group?.name || 'Class Unassigned'} · {student.school?.name}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-px bg-border/50">
                                        <div className="bg-card p-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Attendance</p>
                                            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">{student.attendance_summary?.percentage}%</p>
                                        </div>
                                        <div className="bg-card p-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Average</p>
                                            <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">{student.academic_summary?.latest_average}%</p>
                                        </div>
                                        <div className="bg-card p-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Fees Due</p>
                                            <p className="mt-1 font-semibold text-red-600 dark:text-red-400">MWK {Number(student.finance_summary?.balance_due).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-card p-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Behaviour</p>
                                            <p className="mt-1 font-semibold text-violet-600 dark:text-violet-400">{student.behaviour_summary?.points} / 100</p>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 p-3">
                                        <Link
                                            href={route('portal.children.show', student.id)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border transition-all hover:bg-muted"
                                        >
                                            View Full Profile
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Announcements */}
                    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
                            <Link href={route('portal.announcements')} className="text-sm font-medium text-primary hover:underline">View All</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {announcements.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent announcements.</p>
                            ) : (
                                announcements.map((announcement) => (
                                    <div key={announcement.id} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <ShieldAlert className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-sm font-semibold text-foreground">{announcement.title}</h4>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{announcement.body}</p>
                                            <span className="mt-2 text-xs text-muted-foreground">{format(new Date(announcement.publish_at), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Upcoming Events */}
                    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
                            <Link href={route('portal.calendar')} className="text-sm font-medium text-primary hover:underline">Full Calendar</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {events.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming events.</p>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <span className="text-[10px] font-bold uppercase">{format(new Date(event.start_date), 'MMM')}</span>
                                            <span className="text-lg font-bold leading-none">{format(new Date(event.start_date), 'd')}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                                            {event.is_holiday && <span className="mt-0.5 w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Holiday</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </PortalLayout>
    );
}
