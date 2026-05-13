<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('users.view');

        $query = User::query()->with(['roles', 'school']);

        if (! $request->user()->isSuperAdmin()) {
            $query->where('school_id', $request->user()->school_id);
            $query->whereDoesntHave('roles', function ($q): void {
                $q->where('name', 'super_admin')->where('roles.guard_name', 'web');
            });
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('role')) {
            $query->role($request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role', 'status']),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('users.create');

        return Inertia::render('Users/Create', [
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function edit(Request $request, User $user): Response
    {
        $this->authorize('users.edit');

        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        if ($user->hasRole('super_admin') && ! $request->user()->isSuperAdmin()) {
            abort(403);
        }

        $user->load(['roles', 'school']);

        return Inertia::render('Users/Edit', [
            'user' => (new UserResource($user))->resolve(),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        if (! $request->user()->isSuperAdmin()) {
            $data['school_id'] = $request->user()->school_id;
        }

        $user = User::create($data);
        $user->assignRole($request->role);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        if ($user->hasRole('super_admin') && ! $request->user()->isSuperAdmin()) {
            abort(403);
        }

        $data = $request->validated();

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        if (! $request->user()->isSuperAdmin()) {
            $data['school_id'] = $request->user()->school_id;
        }

        $user->update($data);
        $user->syncRoles([$request->role]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('users.delete');

        if (! request()->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser(request(), $user);
        }

        if ($user->hasRole('super_admin') && ! request()->user()->isSuperAdmin()) {
            abort(403);
        }

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    private function ensureSchoolScopedUser(Request $request, User $target): void
    {
        abort_unless($target->school_id === $request->user()->school_id, 403);
        abort_if($target->hasRole('super_admin'), 403);
    }
}
