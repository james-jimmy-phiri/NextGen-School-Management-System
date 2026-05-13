import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const rows = [
    { at: '09:42', actor: 'system', action: 'Invoice batch #441 queued', scope: 'Finance' },
    { at: '09:18', actor: 'M. Banda', action: 'Marked attendance · Grade 8A', scope: 'Attendance' },
    { at: '08:55', actor: 'A. Tembo', action: 'Published announcement · Exams', scope: 'Communication' },
    { at: '08:12', actor: 'system', action: 'SMS delivery report · 412 sent', scope: 'SMS' },
    { at: 'Yesterday', actor: 'N. Phiri', action: 'Updated student medical flags', scope: 'Health' },
];

export default function DashboardActivity() {
    return (
        <AuthenticatedLayout>
            <Head title="Activity logs" />

            <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Audit trail preview
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                            Activity logs
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Login events, configuration changes, and suspicious signals will stream here when
                            Laravel auditing is connected.
                        </p>
                    </div>
                    <Badge variant="secondary" className="w-fit gap-1 self-start sm:self-auto">
                        <Activity className="h-3.5 w-3.5" aria-hidden />
                        Mock stream
                    </Badge>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent activity</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">Time</th>
                                        <th className="px-6 py-3">Actor</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Module</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {rows.map((row) => (
                                        <tr key={row.at + row.action} className="hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                                {row.at}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground">{row.actor}</td>
                                            <td className="px-6 py-4 text-foreground">{row.action}</td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                    {row.scope}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
