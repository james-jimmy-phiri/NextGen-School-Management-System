import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Badge } from '@/Components/ui/Badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

export type RoleItem = {
    id?: number;
    name: string;
    requires_school?: boolean;
};

interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'suspended';
    role?: string | null;
    roles?: string[];
    school: { id?: number; name?: string } | null;
}

interface Props extends PageProps {
    user: UserData;
    roles: (RoleItem | string)[];
    schools: { id: number; name: string }[];
}

export default function UsersEdit({ user, roles, schools }: Props) {
    const normalizedRoles = useMemo<RoleItem[]>(() => {
        return (roles ?? []).map((r) => {
            if (typeof r === 'string') {
                return {
                    name: r,
                    requires_school: r !== 'super_admin',
                };
            }
            return {
                id: r.id,
                name: r.name,
                requires_school: r.requires_school ?? (r.name !== 'super_admin'),
            };
        });
    }, [roles]);

    const initialRoles = useMemo(() => {
        if (Array.isArray(user.roles) && user.roles.length > 0) {
            return user.roles;
        }
        return user.role ? [user.role] : [];
    }, [user.roles, user.role]);

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role: initialRoles[0] ?? '',
        roles: initialRoles,
        school_id: user.school?.id ? String(user.school.id) : '',
        status: user.status,
    });

    const requiresSchool = useMemo(() => {
        const activeRoleNames = data.roles.length > 0 ? data.roles : (data.role ? [data.role] : []);
        if (activeRoleNames.length === 0) {
            return false;
        }
        return activeRoleNames.some((roleName) => {
            const found = normalizedRoles.find((r) => r.name === roleName);
            return found ? (found.requires_school ?? (found.name !== 'super_admin')) : true;
        });
    }, [data.roles, data.role, normalizedRoles]);

    const toggleRole = (roleName: string) => {
        const current = [...data.roles];
        const exists = current.includes(roleName);
        const next = exists ? current.filter((r) => r !== roleName) : [...current, roleName];
        setData({
            ...data,
            roles: next,
            role: next[0] ?? '',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit user · ${user.name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Users</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Edit user</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Update account details, assign multiple roles, and configure school scoping (FR4.6, FR4.7).
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('users.show', user.id)}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-muted"
                        >
                            View details
                        </Link>
                        <Link
                            href={route('users.index')}
                            className={cn(
                                'inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition hover:bg-muted',
                            )}
                        >
                            Back to list
                        </Link>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name" value="Full name *" />
                            <TextInput
                                id="name"
                                className="mt-2 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email address *" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-2 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="phone" value="Phone (optional)" />
                            <TextInput
                                id="phone"
                                className="mt-2 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.phone} />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status *" />
                            <select
                                id="status"
                                className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value as 'active' | 'inactive' | 'suspended')
                                }
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <InputError className="mt-2" message={errors.status} />
                        </div>
                    </div>

                    {/* FR4.7: Assign User Roles (Multi-Role selection) */}
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                                <InputLabel value="Assigned Roles * (Select all that apply)" />
                                <p className="text-xs text-muted-foreground">
                                    Assign single or multiple functional roles (FR4.7).
                                </p>
                            </div>
                            {data.roles.length > 0 && (
                                <span className="text-xs font-semibold text-primary">
                                    {data.roles.length} role{data.roles.length > 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 pt-1">
                            {normalizedRoles.map((role) => {
                                const checked = data.roles.includes(role.name);
                                return (
                                    <label
                                        key={role.name}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors',
                                            checked
                                                ? 'border-primary/50 bg-primary/10 text-foreground font-semibold'
                                                : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                                            checked={checked}
                                            onChange={() => toggleRole(role.name)}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="capitalize text-foreground">{role.name.replace(/_/g, ' ')}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {role.requires_school ? 'Requires school' : 'Platform / No school'}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        <InputError className="mt-2" message={errors.role || (errors as any).roles} />
                    </div>

                    {/* Password Fields (Optional on update) */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="password" value="New password (leave blank to keep current)" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-2 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm new password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-2 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* School Assignment */}
                    {schools.length > 0 && (
                        <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    <InputLabel
                                        htmlFor="school_id"
                                        value={requiresSchool ? 'School Assignment *' : 'School Assignment (Optional)'}
                                    />
                                </div>
                                {requiresSchool ? (
                                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-700 bg-amber-500/10">
                                        Mandatory for selected role(s)
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-700 bg-emerald-500/10">
                                        Optional for system/platform roles
                                    </Badge>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {requiresSchool
                                    ? 'A school must be selected because one or more selected roles require school scoping.'
                                    : 'Platform administrators and system roles do not require school assignment.'}
                            </p>

                            <select
                                id="school_id"
                                className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                value={data.school_id}
                                onChange={(e) => setData('school_id', e.target.value)}
                                required={requiresSchool}
                            >
                                <option value="">
                                    {requiresSchool ? '— Select a school * —' : 'No school (Platform / System-wide)'}
                                </option>
                                {schools.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.school_id} />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-border pt-6">
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton type="submit" disabled={processing || data.roles.length === 0}>
                            Save changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
