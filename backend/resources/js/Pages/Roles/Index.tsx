import PrimaryButton from '@/Components/PrimaryButton';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import type { AuthUser, PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: string[];
    is_system: boolean;
    requires_school?: boolean;
    users_count: number;
}

interface Props extends PageProps {
    roles: Role[] | { data: Role[] };
    permissionsByModule: Record<string, Permission[]>;
}

function formatRoleLabel(name: string): string {
    return name.replace(/_/g, ' ');
}

export default function RolesIndex({ roles, permissionsByModule }: Props) {
    const page = usePage<PageProps>();
    const flash = page.props.flash;
    const authUser = page.props.auth.user as AuthUser | null;
    const isPlatformSuperAdmin = authUser?.roles?.includes('super_admin') ?? false;

    const rolesData = useMemo(() => (Array.isArray(roles) ? roles : roles.data), [roles]);
    const initialId = rolesData[0]?.id ?? null;
    const [selectedId, setSelectedId] = useState<number | null>(initialId);

    const selectedRole = useMemo(() => {
        if (!rolesData.length) {
            return null;
        }
        if (selectedId != null) {
            const found = rolesData.find((r) => r.id === selectedId);
            if (found) {
                return found;
            }
        }
        return rolesData[0];
    }, [rolesData, selectedId]);

    const serverPermissionSig = selectedRole
        ? `${selectedRole.id}\n${[...selectedRole.permissions].sort().join('\n')}`
        : '';

    const { data, setData, post, processing } = useForm({
        permissions: selectedRole?.permissions ?? [],
    });

    useEffect(() => {
        if (!serverPermissionSig) {
            setData('permissions', []);
            return;
        }
        const parts = serverPermissionSig.split('\n');
        const [, ...perms] = parts;
        setData('permissions', perms);
    }, [serverPermissionSig, setData]);

    const matrixLocked =
        selectedRole?.name === 'super_admin' && !isPlatformSuperAdmin;

    const handleRoleChange = (role: Role) => {
        setSelectedId(role.id);
        setData('permissions', role.permissions);
    };

    const togglePermission = (permissionName: string) => {
        if (matrixLocked) {
            return;
        }
        const next = data.permissions.includes(permissionName)
            ? data.permissions.filter((p) => p !== permissionName)
            : [...data.permissions, permissionName];
        setData('permissions', next);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedRole || matrixLocked) {
            return;
        }
        post(route('roles.update-permissions', selectedRole.id), { preserveScroll: true });
    };

    const modules = useMemo(
        () => Object.keys(permissionsByModule).sort((a, b) => a.localeCompare(b)),
        [permissionsByModule],
    );

    const deleteRole = (role: Role) => {
        if (
            !window.confirm(
                `Delete role «${formatRoleLabel(role.name)}»? This cannot be undone if no users are assigned.`,
            )
        ) {
            return;
        }
        router.delete(route('roles.destroy', role.id));
    };

    const breadcrumbs = [
        { label: 'Settings', href: '/roles' },
        { label: 'Roles & Permissions' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles & permissions" />

            <div className="school-app max-w-[1560px] mx-auto pb-8 space-y-6">
                {flash?.success ? (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {flash.success}
                    </div>
                ) : null}
                {flash?.error ? (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                        {flash.error}
                    </div>
                ) : null}

                <div className="page-title">
                    <div>
                        <div className="eyebrow">IDENTITY &amp; ACCESS</div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                            Roles &amp; Permissions <span className="title-dot" />
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {rolesData.length} roles · Fine-grained permission assignments &amp; institutional access control
                        </p>
                    </div>
                    <div className="title-actions">
                        <Link
                            href={route('roles.create')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            <Plus size={14} />
                            <span>Add role</span>
                        </Link>
                    </div>
                </div>

                {!rolesData.length ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No roles found. Run{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">php artisan db:seed</code>.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-12">
                        <Card className="lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Roles</CardTitle>
                                <CardDescription>Select a role to edit its permission set.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 p-0 px-6 pb-6">
                                {rolesData.map((role) => {
                                    const active = selectedRole?.id === role.id;
                                    return (
                                        <div
                                            key={role.id}
                                            className={cn(
                                                'flex items-center gap-2 rounded-xl border p-2 transition-colors',
                                                active
                                                    ? 'border-primary/40 bg-primary/5'
                                                    : 'border-transparent bg-muted/30 hover:bg-muted/50',
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleRoleChange(role)}
                                                className="min-w-0 flex-1 rounded-lg px-3 py-2 text-left"
                                            >
                                                <p className="truncate text-sm font-semibold capitalize text-foreground">
                                                    {formatRoleLabel(role.name)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-muted-foreground">
                                                        {role.users_count} user{role.users_count === 1 ? '' : 's'}
                                                    </p>
                                                    {role.requires_school === false ? (
                                                        <span className="text-[10px] font-medium text-purple-700 bg-purple-500/10 dark:text-purple-300 rounded px-1.5 py-0.2">
                                                            Platform / No school
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </button>
                                            <div className="flex shrink-0 items-center gap-1">
                                                {role.is_system ? (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        System
                                                    </Badge>
                                                ) : null}
                                                <Link
                                                    href={route('roles.edit', role.id)}
                                                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                    title={role.is_system ? "Configure role" : "Edit role"}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                {!role.is_system ? (
                                                    <button
                                                        type="button"
                                                        title="Delete role"
                                                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600"
                                                        onClick={() => deleteRole(role)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-8">
                            {selectedRole ? (
                                <form onSubmit={submit}>
                                    <Card>
                                        <CardHeader className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <CardTitle className="capitalize">
                                                    {formatRoleLabel(selectedRole.name)}
                                                </CardTitle>
                                                <CardDescription>
                                                    {matrixLocked
                                                        ? 'Only a platform super administrator can change permissions for this role.'
                                                        : 'Toggle capabilities, then save. Changes apply on next request (Spatie cache may apply).'}
                                                </CardDescription>
                                            </div>
                                            <PrimaryButton
                                                type="submit"
                                                disabled={processing || matrixLocked}
                                                className="shrink-0 rounded-lg"
                                            >
                                                Save permissions
                                            </PrimaryButton>
                                        </CardHeader>
                                        {matrixLocked ? (
                                            <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                                <p>
                                                    Your account can view this matrix but cannot modify the super
                                                    administrator role.
                                                </p>
                                            </CardContent>
                                        ) : null}
                                        <CardContent className="max-h-[calc(100vh-16rem)] space-y-8 overflow-y-auto pt-6">
                                            {modules.map((module, midx) => (
                                                <motion.section
                                                    key={module}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: midx * 0.04 }}
                                                    className="space-y-3"
                                                >
                                                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                                                        {module.replace(/_/g, ' ')}
                                                    </h2>
                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        {(permissionsByModule[module] ?? []).map(
                                                            (permission) => {
                                                                const checked = data.permissions.includes(
                                                                    permission.name,
                                                                );
                                                                return (
                                                                    <label
                                                                        key={permission.id}
                                                                        className={cn(
                                                                            'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                                                                            checked
                                                                                ? 'border-primary/35 bg-primary/5'
                                                                                : 'border-border bg-card hover:bg-muted/40',
                                                                            matrixLocked &&
                                                                                'cursor-not-allowed opacity-70',
                                                                        )}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30 disabled:cursor-not-allowed"
                                                                            checked={checked}
                                                                            disabled={matrixLocked}
                                                                            onChange={() =>
                                                                                togglePermission(permission.name)
                                                                            }
                                                                        />
                                                                        <span className="min-w-0">
                                                                            <span className="block text-sm font-semibold capitalize text-foreground">
                                                                                {permission.name
                                                                                    .split('.')
                                                                                    .slice(1)
                                                                                    .join(' ')
                                                                                    .replace(/_/g, ' ') ||
                                                                                    permission.name}
                                                                            </span>
                                                                            <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                                                                                {permission.name}
                                                                            </span>
                                                                        </span>
                                                                    </label>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </motion.section>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </form>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
