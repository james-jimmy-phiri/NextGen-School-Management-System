<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('users.view');

        $query = User::query()->with(['roles', 'school']);

        // FR4.1 & FR4.2: School admin only sees their school; super admin sees all
        if (! $request->user()->isSuperAdmin()) {
            $query->where('school_id', $request->user()->school_id);
            $query->whereDoesntHave('roles', function ($q): void {
                $q->where('name', 'super_admin')->where('roles.guard_name', 'web');
            });
        }

        if ($request->has('search') && $request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('role') && $request->filled('role')) {
            $query->role($request->role);
        }

        if ($request->has('status') && $request->filled('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->latest('id')->paginate(10)->withQueryString();

        $roleOptions = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name', 'requires_school'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'requires_school' => (bool) ($r->requires_school ?? ($r->name !== 'super_admin')),
            ]);

        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role', 'status']),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
            'roleOptions' => $roleOptions,
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('users.create');

        $roleOptions = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name', 'requires_school'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'requires_school' => (bool) ($r->requires_school ?? ($r->name !== 'super_admin')),
            ]);

        return Inertia::render('Users/Create', [
            'roles' => $roleOptions,
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        $this->authorize('users.view');

        // FR4.3 & FR4.4: Super admin can inspect any user; school admin can only inspect their school
        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        if ($user->hasRole('super_admin') && ! $request->user()->isSuperAdmin()) {
            abort(403);
        }

        $user->load(['roles', 'school']);

        // Recent activity audit trail for this user
        $activities = Activity::query()
            ->where(function ($q) use ($user) {
                $q->where('causer_id', $user->id)
                    ->where('causer_type', User::class);
            })
            ->orWhere(function ($q) use ($user) {
                $q->where('subject_id', $user->id)
                    ->where('subject_type', User::class);
            })
            ->latest()
            ->take(25)
            ->get()
            ->map(fn ($act) => [
                'id' => $act->id,
                'description' => $act->description,
                'event' => $act->event,
                'created_at' => $act->created_at?->toDateTimeString(),
                'properties' => $act->properties,
            ]);

        return Inertia::render('Users/Show', [
            'user' => (new UserResource($user))->resolve(),
            'activities' => $activities,
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

        $roleOptions = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name', 'requires_school'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'requires_school' => (bool) ($r->requires_school ?? ($r->name !== 'super_admin')),
            ]);

        return Inertia::render('Users/Edit', [
            'user' => (new UserResource($user))->resolve(),
            'roles' => $roleOptions,
            'schools' => $request->user()->isSuperAdmin() ? School::all(['id', 'name']) : [],
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        if (! $request->user()->isSuperAdmin()) {
            $data['school_id'] = $request->user()->school_id;
        } else {
            // Optional school for system roles: if empty string or null, save as null
            if (empty($data['school_id'])) {
                $data['school_id'] = null;
            }
        }

        $user = User::create($data);

        // FR4.7: Assign single or multiple roles
        $rolesToAssign = (array) ($request->roles ?? [$request->role]);
        $user->syncRoles($rolesToAssign);

        activity('user')
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Created user account with roles: ' . implode(', ', $rolesToAssign));

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
        } else {
            if (array_key_exists('school_id', $data) && empty($data['school_id'])) {
                $data['school_id'] = null;
            }
        }

        $user->update($data);

        // FR4.7: Assign single or multiple roles
        $rolesToAssign = (array) ($request->roles ?? [$request->role]);
        $user->syncRoles($rolesToAssign);

        activity('user')
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Updated user details and roles: ' . implode(', ', $rolesToAssign));

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    // FR4.5: Deactivate with reason provided
    public function deactivate(Request $request, User $user)
    {
        $this->authorize('users.edit');

        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        if ($user->hasRole('super_admin') && ! $request->user()->isSuperAdmin()) {
            abort(403);
        }

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $user->deactivate($validated['reason']);

        activity('user')
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Deactivated user account. Reason: ' . $validated['reason']);

        return back()->with('success', 'User account deactivated.');
    }

    // FR4.5: Reactivate user (enables user to login with last used credentials)
    public function reactivate(Request $request, User $user)
    {
        $this->authorize('users.edit');

        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        if ($user->hasRole('super_admin') && ! $request->user()->isSuperAdmin()) {
            abort(403);
        }

        $user->reactivate();

        activity('user')
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Reactivated user account');

        return back()->with('success', 'User account reactivated.');
    }

    // FR4.5: Unlock temporarily locked account
    public function unlock(Request $request, User $user)
    {
        $this->authorize('users.edit');

        if (! $request->user()->isSuperAdmin()) {
            $this->ensureSchoolScopedUser($request, $user);
        }

        $user->unlock();

        activity('user')
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Unlocked user account');

        return back()->with('success', 'Account unlocked.');
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

        activity('user')
            ->causedBy(request()->user())
            ->performedOn($user)
            ->log('Deleted user account: ' . $user->email);

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    private function ensureSchoolScopedUser(Request $request, User $target): void
    {
        abort_unless($target->school_id === $request->user()->school_id, 403);
        abort_if($target->hasRole('super_admin'), 403);
    }
}
