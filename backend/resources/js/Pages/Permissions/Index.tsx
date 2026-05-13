import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

type PermissionRow = { id: number; name: string; guard_name: string };

interface Props extends PageProps {
    permissionsByModule: Record<string, PermissionRow[]>;
    total: number;
    canRegister?: boolean;
}

function humanizeAction(name: string): string {
    const parts = name.split('.');
    const action = parts.slice(1).join('.') || name;
    return action.replace(/_/g, ' ');
}

function humanizeModule(mod: string): string {
    return mod.replace(/_/g, ' ');
}

export default function PermissionsIndex({ permissionsByModule, total, canRegister }: Props) {
    const page = usePage<PageProps>();
    const flash = page.props.flash;

    const modules = Object.keys(permissionsByModule).sort((a, b) => a.localeCompare(b));

    return (
        <AuthenticatedLayout>
            <Head title="Permissions catalog" />

            <div className="space-y-8">
                {flash?.success ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {flash.success}
                    </div>
                ) : null}
                {flash?.error ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-800 dark:text-red-200">
                        {flash.error}
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Identity & access
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                            Permissions catalog
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Reference of every capability in the system. Roles bundle these permissions; assign
                            roles to users rather than attaching permissions individually.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        {canRegister ? (
                            <Link
                                href={route('permissions.create')}
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
                            >
                                Register permission
                            </Link>
                        ) : null}
                        <Badge variant="secondary" className="w-fit gap-1">
                            <KeyRound className="h-3.5 w-3.5" aria-hidden />
                            {total} permissions
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {modules.map((mod, idx) => (
                        <motion.div
                            key={mod}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.03 }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="capitalize">{humanizeModule(mod)}</CardTitle>
                                    <CardDescription>
                                        {permissionsByModule[mod]?.length ?? 0}{' '}
                                        {permissionsByModule[mod]?.length === 1 ? 'entry' : 'entries'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-0">
                                    {(permissionsByModule[mod] ?? []).map((perm) => (
                                        <div
                                            key={perm.id}
                                            className="flex flex-col gap-0.5 rounded-xl border border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold capitalize text-foreground">
                                                    {humanizeAction(perm.name)}
                                                </p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {perm.name}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                                web
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
