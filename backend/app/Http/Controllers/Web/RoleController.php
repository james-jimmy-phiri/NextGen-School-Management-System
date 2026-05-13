<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * @return array<int, string>
     */
    private function systemRoleNames(): array
    {
        return config('rbac.system_role_names', []);
    }

    private function isSystemRole(Role $role): bool
    {
        return in_array($role->name, $this->systemRoleNames(), true);
    }

    public function index(): Response
    {
        $this->authorize('roles.manage');

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->with(['permissions' => fn ($q) => $q->where('permissions.guard_name', 'web')])
            ->withCount('users')
            ->orderBy('name')
            ->get();

        $permissionsByModule = Permission::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get()
            ->groupBy(fn (Permission $perm) => explode('.', $perm->name)[0] ?? 'general')
            ->map(
                fn ($group) => $group
                    ->map(
                        fn (Permission $p) => [
                            'id' => $p->id,
                            'name' => $p->name,
                        ],
                    )
                    ->values(),
            )
            ->all();

        return Inertia::render('Roles/Index', [
            'roles' => RoleResource::collection($roles)->toArray(request()),
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('roles.manage');

        return Inertia::render('Roles/Create');
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        Role::create([
            'name' => $request->validated()['name'],
            'guard_name' => 'web',
        ]);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role created. Assign permissions from the matrix.');
    }

    public function edit(Role $role): Response
    {
        $this->authorize('roles.manage');

        abort_unless($role->guard_name === 'web', 404);
        abort_if($this->isSystemRole($role), 403, 'Built-in roles cannot be renamed.');

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
            ],
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        abort_unless($role->guard_name === 'web', 404);
        abort_if($this->isSystemRole($role), 403, 'Built-in roles cannot be renamed.');

        $role->update(['name' => $request->validated()['name']]);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role name updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('roles.manage');

        abort_unless($role->guard_name === 'web', 404);
        abort_if($this->isSystemRole($role), 403, 'Built-in roles cannot be deleted.');

        if ($role->users()->count() > 0) {
            return back()->with('error', 'Reassign users before deleting this role.');
        }

        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role removed.');
    }

    public function updatePermissions(Request $request, Role $role): RedirectResponse
    {
        $this->authorize('roles.manage');

        abort_unless($role->guard_name === 'web', 404);

        if ($role->name === 'super_admin' && ! $request->user()->isSuperAdmin()) {
            abort(403, 'Only a platform super administrator can change this role.');
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'max:128'],
        ]);

        $permissions = Permission::query()
            ->where('guard_name', 'web')
            ->whereIn('name', $validated['permissions'])
            ->get();

        if ($permissions->count() !== count(array_unique($validated['permissions']))) {
            return back()->with('error', 'One or more permission names are invalid.');
        }

        $role->syncPermissions($permissions);

        return back()->with('success', "Permissions for «{$role->name}» saved.");
    }
}
