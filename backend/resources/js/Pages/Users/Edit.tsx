import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface UserRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'suspended';
    role: string;
    school: { id: number; name: string } | null;
}

interface Props extends PageProps {
    user: UserRow;
    roles: string[];
    schools: { id: number; name: string }[];
}

export default function UsersEdit({ user, roles, schools }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        password: '',
        password_confirmation: '',
        role: user.role,
        school_id: user.school?.id?.toString() ?? '',
        status: user.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit · ${user.name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Users</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Edit user</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Update profile, role, and access status.</p>
                    </div>
                    <Link
                        href={route('users.index')}
                        className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition hover:bg-muted',
                        )}
                    >
                        Back to list
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name" value="Full name" />
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
                            <InputLabel htmlFor="email" value="Email" />
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
                            <InputLabel htmlFor="role" value="Role" />
                            <select
                                id="role"
                                className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.role} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="password" value="New password (optional)" />
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

                    <div className="grid gap-6 sm:grid-cols-2">
                        {schools.length > 0 ? (
                            <div>
                                <InputLabel htmlFor="school_id" value="School" />
                                <select
                                    id="school_id"
                                    className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                    value={data.school_id}
                                    onChange={(e) => setData('school_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select school</option>
                                    {schools.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.school_id} />
                            </div>
                        ) : null}
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
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

                    <div className="flex justify-end gap-3 border-t border-border pt-6">
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton type="submit" disabled={processing}>
                            Save changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
