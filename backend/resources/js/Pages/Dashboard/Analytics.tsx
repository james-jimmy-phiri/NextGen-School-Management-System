import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardChartsGrid } from '@/Components/Dashboard/DashboardChartsGrid';
import { Badge } from '@/Components/ui/Badge';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

export default function DashboardAnalytics() {
    return (
        <AuthenticatedLayout>
            <Head title="Analytics dashboard" />

            <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Leadership view
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                            Analytics dashboard
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Attendance trends, academic performance, finance, enrollment, gender mix, and
                            debtor analytics — powered by mock data until APIs are wired.
                        </p>
                    </div>
                    <Badge variant="outline" className="w-fit gap-1 self-start sm:self-auto">
                        <LineChart className="h-3.5 w-3.5" aria-hidden />
                        Recharts preview
                    </Badge>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <DashboardChartsGrid />
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
