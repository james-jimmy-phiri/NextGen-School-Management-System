import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function RolesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        requires_school: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Settings' }, { label: 'Roles & Permissions', href: route('roles.index') }, { label: 'Create Role' }]}>
            <Head title="Create role" />

            <div className="mx-auto max-w-lg space-y-8">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Roles</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Create role</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Use a short internal name (snake_case). After creation, open{' '}
                        <span className="font-medium text-foreground">Roles</span> to attach permissions.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                    <div>
                        <InputLabel htmlFor="name" value="Role key *" />
                        <TextInput
                            id="name"
                            className="mt-2 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value.toLowerCase())}
                            placeholder="e.g. deputy_registrar, exam_officer"
                            autoComplete="off"
                            required
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                            Lowercase letters, numbers, and underscores. Must start with a letter. Cannot match a
                            built-in role name.
                        </p>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    {/* Configure whether role needs mandatory school choice or not */}
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                                checked={data.requires_school}
                                onChange={(e) => setData('requires_school', e.target.checked)}
                            />
                            <div>
                                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    School selection mandatory for this role
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {data.requires_school
                                        ? 'Users assigned to this role must select a specific school.'
                                        : 'Platform/System role: users with this role do NOT require a school assignment (school choice will be optional).'}
                                </p>
                            </div>
                        </label>
                        <InputError className="mt-1" message={(errors as any).requires_school} />
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <Link
                            href={route('roles.index')}
                            className={cn(
                                'inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground shadow-sm transition hover:bg-muted',
                            )}
                        >
                            Cancel
                        </Link>
                        <PrimaryButton type="submit" disabled={processing}>
                            Create role
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
