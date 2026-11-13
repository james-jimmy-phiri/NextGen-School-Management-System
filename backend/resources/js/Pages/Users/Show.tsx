import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/Card';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { cn } from '@/lib/utils';
import type { AuthUser, PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    Lock,
    Pencil,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Unlock,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

interface UserData {
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
    role?: string | null;
    roles: string[];
    permissions: string[];
    school: { id?: number; name?: string } | null;
    last_login_at: string | null;
    last_login_ip?: string | null;
    created_at: string;
}

interface ActivityItem {
    id: number;
    description: string;
    event?: string;
    created_at: string;
    properties?: any;
}

interface Props extends PageProps {
    user: UserData;
    activities: ActivityItem[];
}

export default function UserShow({ user, activities }: Props) {
    const page = usePage<PageProps>();
    const flash = page.props.flash;
    const authUser = page.props.auth.user as AuthUser | null;
    const perms = (authUser?.permissions ?? []).map(String);
    const rolesList = (authUser?.roles ?? []).map(String);
    const canEdit = perms.includes('users.edit') || rolesList.includes('super_admin') || rolesList.includes('school_director');

    const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
    const { data: deactData, setData: setDeactData, post: postDeact, processing: deactProcessing, errors: deactErrors, reset: resetDeact } = useForm({
        reason: '',
    });

    const handleDeactivate = (e: React.FormEvent) => {
        e.preventDefault();
        postDeact(route('users.deactivate', user.id), {
            onSuccess: () => {
                setDeactivateModalOpen(false);
                resetDeact();
            },
        });
    };

    const handleReactivate = () => {
        if (confirm(`Reactivate user account for ${user.name}? This will restore access using their existing credentials.`)) {
            router.post(route('users.reactivate', user.id));
        }
    };

    const handleUnlock = () => {
        if (confirm(`Unlock user account for ${user.name}?`)) {
            router.post(route('users.unlock', user.id));
        }
    };

    const statusBadge = () => {
        if (user.locked_at) {
            return (
                <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 gap-1">
                    <Lock className="h-3 w-3" /> Locked
                </Badge>
            );
        }
        if (user.status === 'active') {
            return (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Active
                </Badge>
            );
        }
        if (user.status === 'inactive') {
            return (
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    Deactivated / Inactive
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300">
                Suspended
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`User · ${user.name}`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-800 dark:text-red-200">
                        {flash.error}
                    </div>
                )}

                {/* Navigation Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('users.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            title="Back to users"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h1>
                                {statusBadge()}
                            </div>
                            <p className="text-xs text-muted-foreground">User ID #{user.id} · Created {user.created_at}</p>
                        </div>
                    </div>

                    {canEdit && (
                        <div className="flex flex-wrap items-center gap-2">
                            {user.locked_at && (
                                <button
                                    onClick={handleUnlock}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
                                >
                                    <Unlock className="h-3.5 w-3.5" /> Unlock account
                                </button>
                            )}

                            {user.status === 'active' ? (
                                <button
                                    onClick={() => setDeactivateModalOpen(true)}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-500/20 dark:text-rose-300"
                                >
                                    <UserX className="h-3.5 w-3.5" /> Deactivate
                                </button>
                            ) : (
                                <button
                                    onClick={handleReactivate}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                                >
                                    <UserCheck className="h-3.5 w-3.5" /> Reactivate
                                </button>
                            )}

                            <Link
                                href={route('users.edit', user.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Edit details
                            </Link>
                        </div>
                    )}
                </div>

                {/* Status Notice if deactivated or locked */}
                {(user.deactivated_reason || user.locked_reason) && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
                        {user.locked_reason && (
                            <p>
                                <strong className="font-semibold">Lockout Reason:</strong> {user.locked_reason} (at {user.locked_at})
                            </p>
                        )}
                        {user.deactivated_reason && (
                            <p>
                                <strong className="font-semibold">Deactivation Reason:</strong> {user.deactivated_reason} (at {user.deactivated_at})
                            </p>
                        )}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Primary Info */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base">Profile & Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                                    {user.avatar_initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <div className="border-t border-border pt-3 space-y-2.5">
                                <div>
                                    <span className="text-xs text-muted-foreground">Phone number</span>
                                    <p className="font-medium text-foreground">{user.phone || '—'}</p>
                                </div>

                                <div>
                                    <span className="text-xs text-muted-foreground">School assignment</span>
                                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        {user.school?.name ? (
                                            user.school.name
                                        ) : (
                                            <span className="text-muted-foreground italic">Platform / No school assigned</span>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs text-muted-foreground">Last sign-in</span>
                                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        {user.last_login_at ? (
                                            `${user.last_login_at} ${user.last_login_ip ? `(${user.last_login_ip})` : ''}`
                                        ) : (
                                            'Never signed in'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles & Permissions */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" /> Roles & Permissions
                            </CardTitle>
                            <CardDescription>
                                Roles assigned to this account and effective capabilities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Assigned Roles ({user.roles.length})
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.roles.map((r) => (
                                        <Badge key={r} variant="secondary" className="px-2.5 py-1 text-xs capitalize">
                                            {r.replace(/_/g, ' ')}
                                        </Badge>
                                    ))}
                                    {user.roles.length === 0 && (
                                        <span className="text-xs text-muted-foreground italic">No roles assigned</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Effective Permissions ({user.permissions.length})
                                </span>
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3">
                                    {user.permissions.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.permissions.map((p) => (
                                                <code
                                                    key={p}
                                                    className="rounded bg-background px-2 py-0.5 text-[11px] font-mono text-muted-foreground border border-border"
                                                >
                                                    {p}
                                                </code>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No direct permissions</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FR4.3 / FR4.4: User Activities & Audit Trail */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> User Activity History
                        </CardTitle>
                        <CardDescription>
                            Audited actions performed by or on this account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activities.length > 0 ? (
                            <div className="space-y-3">
                                {activities.map((act) => (
                                    <div
                                        key={act.id}
                                        className="flex items-start justify-between rounded-lg border border-border p-3 text-sm transition hover:bg-muted/30"
                                    >
                                        <div>
                                            <p className="font-medium text-foreground">{act.description}</p>
                                            {act.event && (
                                                <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                                                    {act.event}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{act.created_at}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                No activity recorded for this user yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Deactivation Modal */}
            <Modal show={deactivateModalOpen} onClose={() => setDeactivateModalOpen(false)}>
                <form onSubmit={handleDeactivate} className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground">Deactivate User Account</h2>
                    <p className="text-sm text-muted-foreground">
                        Please provide a reason for deactivating <strong>{user.name}</strong>. The user will be immediately logged out and unable to access the system until reactivated.
                    </p>

                    <div>
                        <InputLabel htmlFor="reason" value="Deactivation reason *" />
                        <TextInput
                            id="reason"
                            className="mt-1 block w-full"
                            value={deactData.reason}
                            onChange={(e) => setDeactData('reason', e.target.value)}
                            placeholder="e.g. End of contract, prolonged absence, policy violation..."
                            required
                        />
                        <InputError className="mt-2" message={deactErrors.reason} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <SecondaryButton type="button" onClick={() => setDeactivateModalOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="submit" disabled={deactProcessing || !deactData.reason.trim()}>
                            Deactivate Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
