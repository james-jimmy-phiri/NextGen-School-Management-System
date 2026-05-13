import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RolesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AuthenticatedLayout>
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
                        <InputLabel htmlFor="name" value="Role key" />
                        <TextInput
                            id="name"
                            className="mt-2 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value.toLowerCase())}
                            placeholder="e.g. deputy_registrar"
                            autoComplete="off"
                            required
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                            Lowercase letters, numbers, and underscores. Must start with a letter. Cannot match a
                            built-in role name.
                        </p>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
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
