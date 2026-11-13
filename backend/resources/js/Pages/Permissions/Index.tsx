import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { NAVIGATION_PERMISSIONS_DIRECTORY } from '@/config/appNavigation';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { KeyRound, LayoutGrid, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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
    const [activeTab, setActiveTab] = useState<'catalog' | 'menu-matrix'>('catalog');

    const modules = Object.keys(permissionsByModule).sort((a, b) => a.localeCompare(b));

    return (
        <AuthenticatedLayout>
            <Head title="Permissions & Access Matrix" />

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
                            Permissions & Access Control
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Reference of system capabilities and strict menu/page authorization gating.
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

                {/* Tab switcher */}
                <div className="flex border-b border-border">
                    <button
                        type="button"
                        onClick={() => setActiveTab('catalog')}
                        className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
                            activeTab === 'catalog'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <KeyRound className="h-4 w-4" />
                        Permissions catalog ({total})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('menu-matrix')}
                        className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
                            activeTab === 'menu-matrix'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Menu & Page Authorization Matrix
                    </button>
                </div>

                {activeTab === 'catalog' && (
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
                )}

                {activeTab === 'menu-matrix' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Menu, Submenu & Page Access Control Specification</CardTitle>
                            <CardDescription>
                                Explicit rules governing visibility and route-level authorization. Users lacking the required permission or school context will neither see these navigation options nor be able to access the pages directly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Menu</th>
                                            <th className="px-4 py-3">Submenu / Page</th>
                                            <th className="px-4 py-3">Required Permission</th>
                                            <th className="px-4 py-3">School Context</th>
                                            <th className="px-4 py-3">Permitted Roles</th>
                                            <th className="px-4 py-3">Policy Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {NAVIGATION_PERMISSIONS_DIRECTORY.map((entry, index) => (
                                            <tr key={index} className="hover:bg-muted/10">
                                                <td className="px-4 py-3.5 font-semibold text-foreground">
                                                    {entry.menu}
                                                </td>
                                                <td className="px-4 py-3.5 text-foreground">
                                                    <span className="font-medium">{entry.submenu}</span>
                                                    <span className="block font-mono text-[11px] text-muted-foreground">
                                                        {entry.routeOrKey}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground">
                                                        {entry.requiredPermission}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {entry.requiresSchool ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                                            <ShieldAlert className="h-3.5 w-3.5" />
                                                            Mandatory (School-scoped)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                            <ShieldCheck className="h-3.5 w-3.5" />
                                                            Platform / Optional
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap gap-1">
                                                        {entry.allowedRoles.map((role, rIdx) => (
                                                            <span
                                                                key={rIdx}
                                                                className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium"
                                                            >
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                    {entry.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
