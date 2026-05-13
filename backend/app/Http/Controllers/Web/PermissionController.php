<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('users.view');

        $permissions = Permission::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name', 'guard_name']);

        $byModule = $permissions
            ->groupBy(fn (Permission $p) => explode('.', $p->name, 2)[0] ?? 'general')
            ->map(fn ($group) => $group->values()->all())
            ->all();

        return Inertia::render('Permissions/Index', [
            'permissionsByModule' => $byModule,
            'total' => $permissions->count(),
            'canRegister' => $request->user()->can('roles.manage'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('roles.manage');

        return Inertia::render('Permissions/Create');
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $name = $request->validated()['name'];

        Permission::findOrCreate($name, 'web');
        Permission::findOrCreate($name, 'sanctum');

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()
            ->route('permissions.index')
            ->with('success', "Permission «{$name}» registered for web and API guards.");
    }
}
