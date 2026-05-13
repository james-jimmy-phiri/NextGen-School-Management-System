import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Database, Sparkles } from 'lucide-react';

export type ModulePageProps = {
    pageKey: string;
    title: string;
    description: string;
    features: string[];
    breadcrumbs: string[];
};

export default function ModulePage({
    title,
    description,
    features,
    breadcrumbs,
}: ModulePageProps) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="space-y-8">
                <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                    <ol className="flex flex-wrap items-center gap-2">
                        {['App', ...breadcrumbs].map((crumb, i, arr) => (
                            <li key={`${crumb}-${i}`} className="flex items-center gap-2">
                                {i > 0 ? <span className="text-border">/</span> : null}
                                <span
                                    className={
                                        i === arr.length - 1
                                            ? 'font-medium text-foreground'
                                            : undefined
                                    }
                                >
                                    {crumb}
                                </span>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                                <Sparkles className="h-3 w-3" aria-hidden />
                                UI scaffold
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <Database className="h-3 w-3" aria-hidden />
                                API-ready
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </motion.div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Planned capabilities</CardTitle>
                        <CardDescription>
                            Wire these screens to Laravel controllers and policies when you are ready.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {features.map((f) => (
                                <li
                                    key={f}
                                    className="flex items-start gap-2 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                                >
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
