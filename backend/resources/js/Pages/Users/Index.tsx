import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import type { AuthUser, LaravelPagination, PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Pencil,
    Plus,
    Trash2,
    Unlock,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'suspended';
    locked_at?: string | null;
    locked_reason?: string | null;
    deactivated_at?: string | null;
    deactivated_reason?: string | null;
    avatar_initials: string;
    role?: string;
    roles?: string[];
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

    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [selectedRole, setSelectedRole] = useState(filters?.role ?? '');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
    const [deactivateReason, setDeactivateReason] = useState('');
    const [deactivateProcessing, setDeactivateProcessing] = useState(false);

    const isTeacherView = filters?.role === 'teacher';
    const pageTitle = isTeacherView ? 'Teachers' : 'Teachers';
    const singular = isTeacherView ? 'teacher' : 'teacher';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('users.index'),
            {
                ...filters,
                search: searchQuery || undefined,
                role: selectedRole || undefined,
            },
            { preserveState: true },
        );
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        router.get(
            route('users.index'),
            {
                ...filters,
                search: searchQuery || undefined,
                role: role || undefined,
            },
            { preserveState: true },
        );
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status'];
        const csvRows = users.data.map((u) => [
            `TCH-${String(u.id).padStart(4, '0')}`,
            `"${u.name.replace(/"/g, '""')}"`,
            u.email,
            u.phone ?? '',
            u.role ?? (u.roles?.[0] ?? 'Staff'),
            u.status,
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `teachers_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeactivate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToDeactivate || !deactivateReason.trim()) return;
        setDeactivateProcessing(true);
        router.post(
            route('users.deactivate', userToDeactivate.id),
            { reason: deactivateReason },
            {
                onSuccess: () => {
                    setDeactivateOpen(false);
                    setUserToDeactivate(null);
                    setDeactivateReason('');
                },
                onFinish: () => setDeactivateProcessing(false),
            },
        );
    };

    const handleReactivate = (u: User) => {
        if (confirm(`Reactivate user account for ${u.name}? Access will be restored using their existing credentials.`)) {
            router.post(route('users.reactivate', u.id));
        }
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

    const breadcrumbs = [
        { label: 'School Management', href: '/users' },
        { label: pageTitle },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Flash Messages ────────────────────────────────────────────── */}
                {flash?.success ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                ) : null}

                {/* ─── Page Title Header (Stitch Design) ───────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            SCHOOL MANAGEMENT
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            {pageTitle}
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {users.total} {users.total === 1 ? singular : `${singular}s`} · 2026–2027 academic year
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 transition-all cursor-pointer dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted"
                        >
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                            <span>Export</span>
                        </button>
                        {canCreate ? (
                            <Link
                                href={route('users.create')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Add {singular}</span>
                            </Link>
                        ) : null}
                    </div>
                </div>

                {/* ─── Panel with Directory Table ───────────────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>{pageTitle} directory</h2>
                        <span className="record-count">{users.total} records</span>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <form onSubmit={handleSearch} className="search-field">
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                type="text"
                                placeholder={`Search ${singular}s...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        <select
                            className="directory-select"
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                        >
                            <option value="">All groups</option>
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="table-scroll">
                        <table className="school-table directory-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            <p className="text-xs font-semibold">No records found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const displayId = `TCH-${String(user.id).padStart(4, '0')}`;
                                        const primaryRole =
                                            user.roles?.[0] ?? user.role ?? 'Teacher';
                                        const subjectLabel =
                                            primaryRole === 'teacher' ? 'Mathematics' : primaryRole.replace(/_/g, ' ');

                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="person-cell">
                                                        <UserAvatar name={user.name} initials={user.avatar_initials} size="sm" />
                                                        <div className="person-name">
                                                            <strong>{user.name}</strong>
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{displayId}</td>
                                                <td>
                                                    <span className="class-tag capitalize">
                                                        {subjectLabel}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={cn(
                                                            'status-pill',
                                                            user.status === 'active'
                                                                ? 'positive'
                                                                : 'pending',
                                                        )}
                                                    >
                                                        <span className="status-pill-dot" />
                                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="row-actions justify-end">
                                                        <Link
                                                            href={route('users.show', user.id)}
                                                            title="View details"
                                                        >
                                                            <Eye size={13} />
                                                        </Link>
                                                        {canEdit ? (
                                                            <Link
                                                                href={route('users.edit', user.id)}
                                                                title="Edit details"
                                                            >
                                                                <Pencil size={13} />
                                                            </Link>
                                                        ) : null}
                                                        {canDelete ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setUserToDelete(user);
                                                                    setDeleteOpen(true);
                                                                }}
                                                                title="Delete"
                                                                className="action-delete"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {users.data.length > 0 ? `1–${users.data.length}` : '0'} of {users.total} records
                        </span>
                        <div>
                            <button
                                type="button"
                                disabled={users.current_page <= 1}
                                onClick={() =>
                                    users.prev_page_url && router.visit(users.prev_page_url)
                                }
                            >
                                <ChevronLeft size={13} />
                            </button>
                            <span>
                                Page {users.current_page} of {users.last_page}
                            </span>
                            <button
                                type="button"
                                disabled={users.current_page >= users.last_page}
                                onClick={() =>
                                    users.next_page_url && router.visit(users.next_page_url)
                                }
                            >
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal show={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete {singular}?</h3>
                    <p className="mt-2 text-xs text-slate-500">
                        Remove access for <strong className="text-slate-900 dark:text-white">{userToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setDeleteOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="button" onClick={confirmDelete}>
                            Delete record
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Deactivation Modal */}
            <Modal show={deactivateOpen} onClose={() => setDeactivateOpen(false)} maxWidth="md">
                <form onSubmit={handleDeactivate} className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deactivate User Account</h3>
                    <p className="text-xs text-slate-500">
                        Provide a reason for deactivating <strong className="text-slate-900 dark:text-white">{userToDeactivate?.name}</strong>.
                    </p>

                    <div>
                        <InputLabel htmlFor="deact_reason" value="Deactivation Reason *" />
                        <TextInput
                            id="deact_reason"
                            className="mt-1 block w-full"
                            value={deactivateReason}
                            onChange={(e) => setDeactivateReason(e.target.value)}
                            placeholder="e.g. Inactivity, contract completion, leave of absence..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-border">
                        <SecondaryButton type="button" onClick={() => setDeactivateOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="submit" disabled={deactivateProcessing || !deactivateReason.trim()}>
                            Deactivate Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
