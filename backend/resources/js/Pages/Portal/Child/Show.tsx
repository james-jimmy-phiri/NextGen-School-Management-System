import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Wallet, Activity, HeartPulse, Calendar, FileText, User } from 'lucide-react';
import type { PageProps } from '@/types';
import { format } from 'date-fns';

export default function ChildShow({ student }: PageProps<{ student: any }>) {
    const sections = [
        { name: 'Attendance', href: 'portal.children.attendance', icon: Clock, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400', desc: 'View monthly calendar & history' },
        { name: 'Academics', href: 'portal.children.academics', icon: BookOpen, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400', desc: 'Subject marks & report cards' },
        { name: 'Finances', href: 'portal.children.fees', icon: Wallet, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400', desc: 'Fee statements & payments' },
        { name: 'Behaviour', href: 'portal.children.behaviour', icon: Activity, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400', desc: 'Discipline & positive awards' },
        { name: 'Health', href: 'portal.children.health', icon: HeartPulse, color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400', desc: 'Medical alerts & clinic visits' },
        { name: 'Timetable', href: 'portal.children.timetable', icon: Calendar, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400', desc: 'Weekly schedule & teachers' },
        { name: 'Documents', href: 'portal.children.documents', icon: FileText, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', desc: 'Downloadable school files' },
    ];

    return (
        <PortalLayout>
            <Head title={`${student.first_name}'s Profile`} />

            <SectionHeader 
                title={`${student.first_name}'s Hub`} 
                subtitle="Select an area to view detailed records"
                backHref={route('portal.parent')}
                icon={User}
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:col-span-1">
                    <div className="flex flex-col items-center border-b border-border p-6 text-center">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-4 ring-background">
                            {student.photo_path ? (
                                <img src={`/storage/${student.photo_path}`} alt={student.first_name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold uppercase">{student.first_name[0]}{student.last_name[0]}</span>
                            )}
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-foreground">{student.first_name} {student.last_name}</h2>
                        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{student.admission_number}</p>
                        <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {student.enrollments?.[0]?.class_group?.name || 'Class Unassigned'}
                        </span>
                    </div>
                    <div className="flex flex-col p-6 text-sm">
                        <div className="mb-3 grid grid-cols-3 gap-2 border-b border-border pb-3">
                            <span className="text-muted-foreground">DOB</span>
                            <span className="col-span-2 font-medium text-foreground">{student.date_of_birth ? format(new Date(student.date_of_birth), 'MMM d, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="mb-3 grid grid-cols-3 gap-2 border-b border-border pb-3">
                            <span className="text-muted-foreground">Gender</span>
                            <span className="col-span-2 font-medium text-foreground capitalize">{student.gender || 'N/A'}</span>
                        </div>
                        <div className="mb-3 grid grid-cols-3 gap-2 border-b border-border pb-3">
                            <span className="text-muted-foreground">Status</span>
                            <span className="col-span-2 font-medium text-foreground capitalize">{student.status}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">School</span>
                            <span className="col-span-2 font-medium text-foreground">{student.school?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={section.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link
                                href={route(section.href, student.id)}
                                className="group flex h-full items-start gap-4 rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${section.color} transition-transform group-hover:scale-110`}>
                                    <section.icon className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{section.name}</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">{section.desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PortalLayout>
    );
}
