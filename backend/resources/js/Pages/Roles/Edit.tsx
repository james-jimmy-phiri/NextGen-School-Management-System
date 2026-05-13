import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props extends PageProps {
    role: { id: number; name: string };
}

export default function RolesEdit({ role }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: role.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('roles.update', role.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit role · ${role.name}`} />

            <div className="mx-auto max-w-lg space-y-8">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Roles</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Rename role</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Built-in roles cannot be renamed. Permission changes are done from the main roles screen.
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
                            required
                        />
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
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
