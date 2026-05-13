<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'flash' => [
                'status' => $request->session()->get('status'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'school_id' => $user->school_id,
                    'roles' => $user->getRoleNames()->values(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                    'preferences' => $user->preferences,
                    'school' => optional($user->loadMissing('school')->school)?->only(['id', 'name', 'slug', 'logo_path', 'timezone', 'locale', 'settings']),
                ] : null,
            ],
            'capabilities' => [
                'offline_attendance_ready' => true,
                'push_architecture_ready' => true,
                'can_view_audit_logs' => $user ? $user->can('audit.view') : false,
            ],
        ];
    }
}
