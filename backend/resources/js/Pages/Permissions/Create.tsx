import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function PermissionsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('permissions.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register permission" />

            <div className="mx-auto max-w-lg space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Permissions</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Register permission</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Add a new capability key in the form <code className="rounded bg-muted px-1">module.action</code>.
                            It will be created for both web and API guards. Assign it to roles from the Roles screen.
                        </p>
                    </div>
                    <Link
                        href={route('permissions.index')}
                        className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition hover:bg-muted',
                        )}
                    >
                        Catalog
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                    <div>
                        <InputLabel htmlFor="name" value="Permission key" />
                        <TextInput
                            id="name"
                            className="mt-2 block w-full font-mono text-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value.toLowerCase())}
                            placeholder="e.g. library.reports"
                            autoComplete="off"
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={route('permissions.index')}
                            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton type="submit" disabled={processing}>
                            Save permission
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
