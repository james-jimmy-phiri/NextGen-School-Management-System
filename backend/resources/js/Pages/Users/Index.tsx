import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import type { AuthUser, LaravelPagination, PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'suspended';
    avatar_initials: string;
    role: string;
    school: { id: number; name: string } | null;
    last_login_at: string | null;
    last_login_ip?: string | null;
    created_at: string;
}

interface Props extends PageProps {
    users: LaravelPagination<User>;
    roles: string[];
    schools: { id: number; name: string }[];
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function UserIndex({ users, roles, filters }: Props) {
    const page = usePage<PageProps>();
    const flash = page.props.flash;
    const authUser = page.props.auth.user as AuthUser | null;
    const perms = (authUser?.permissions ?? []).map(String);
    const rolesList = (authUser?.roles ?? []).map(String);
    const adminStaff = ['super_admin', 'school_director', 'school_admin'];
    const canCreate = perms.includes('users.create') || rolesList.some((r) => adminStaff.includes(r));
    const canEdit = perms.includes('users.edit') || rolesList.some((r) => adminStaff.includes(r));
    const canDelete = perms.includes('users.delete') || rolesList.includes('super_admin');

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const statusColors = {
        active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-300',
        inactive: 'bg-muted text-muted-foreground border-border',
        suspended: 'bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-300',
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users" />

            <div className="space-y-6">
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

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Identity & access
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Users</h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Staff and portal accounts for your school. Use roles to control what each person can
                            see and do.
                        </p>
                    </div>
                    {canCreate ? (
                        <Link
                            href={route('users.create')}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
                        >
                            <Plus className="h-4 w-4" aria-hidden />
                            Add user
                        </Link>
                    ) : null}
                </div>

                <Card>
                    <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <span className="text-sm">⌕</span>
                            </span>
                            <input
                                type="text"
                                placeholder="Search name or email…"
                                className="block w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
                                defaultValue={filters.search}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.get(
                                            route('users.index'),
                                            {
                                                ...filters,
                                                search: (e.target as HTMLInputElement).value,
                                            },
                                            { preserveState: true },
                                        );
                                    }
                                }}
                            />
                        </div>

                        <select
                            className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition focus:border-primary/40 focus:ring-2"
                            value={filters.role ?? ''}
                            onChange={(e) =>
                                router.get(
                                    route('users.index'),
                                    { ...filters, role: e.target.value },
                                    { preserveState: true },
                                )
                            }
                        >
                            <option value="">All roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>

                        <select
                            className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition focus:border-primary/40 focus:ring-2"
                            value={filters.status ?? ''}
                            onChange={(e) =>
                                router.get(
                                    route('users.index'),
                                    { ...filters, status: e.target.value },
                                    { preserveState: true },
                                )
                            }
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-left text-sm">
                            <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">School</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Last login</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {users.data.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 text-sm font-bold text-primary">
                                                    {user.avatar_initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    {user.phone ? (
                                                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize text-foreground">
                                                {user.role.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.school?.name ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                                    statusColors[user.status],
                                                )}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                            {user.last_login_at ? (
                                                <span>
                                                    {new Date(user.last_login_at).toLocaleString()}
                                                    {user.last_login_ip ? (
                                                        <span className="mt-0.5 block text-[10px]">
                                                            {user.last_login_ip}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            ) : (
                                                <span className="italic">Never</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {canEdit ? (
                                                    <Link
                                                        href={route('users.edit', user.id)}
                                                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                ) : null}
                                                {canDelete ? (
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600"
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setDeleteOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        Showing <strong className="text-foreground">{users.data.length}</strong> of{' '}
                        <strong className="text-foreground">{users.total}</strong> users
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {(users.meta?.links || (Array.isArray(users.links) ? users.links : [])).map(
                            (link) => (
                                <button
                                    key={link.label + String(link.url)}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url, filters, { preserveState: true })
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-card text-muted-foreground hover:bg-muted',
                                        !link.url && 'cursor-not-allowed opacity-40',
                                    )}
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>

            <Modal show={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">Remove user</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Remove access for <strong className="text-foreground">{userToDelete?.name}</strong>? This
                        cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setDeleteOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="button" onClick={confirmDelete}>
                            Delete user
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
