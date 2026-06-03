<?php

namespace App\Http\Middleware;

use App\Models\Student;
use App\Support\SchoolBranding;
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
        $flashPayload = $request->session()->get('flash');

        return [
            ...parent::share($request),
            'flash' => [
                'status' => $request->session()->get('status'),
                'success' => $request->session()->get('success')
                    ?? (is_array($flashPayload) ? ($flashPayload['success'] ?? null) : null),
                'error' => $request->session()->get('error')
                    ?? (is_array($flashPayload) ? ($flashPayload['error'] ?? null) : null),
                'reference_number' => is_array($flashPayload) ? ($flashPayload['reference_number'] ?? null) : null,
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
                    'school' => optional($user->loadMissing('school')->school)?->only([
                        'id', 'name', 'slug', 'logo_path', 'timezone', 'locale', 'settings',
                        'primary_color', 'secondary_color',
                    ]),
                ] : null,
            ],
            'portal' => fn () => $this->portalContext($request),
            'capabilities' => [
                'offline_attendance_ready' => true,
                'push_architecture_ready' => true,
                'can_view_audit_logs' => $user ? $user->can('audit.view') : false,
            ],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function portalContext(Request $request): ?array
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole('parent') || ! $request->routeIs('portal.*')) {
            return null;
        }

        $children = Student::query()
            ->whereHas('guardians', fn ($query) => $query->where('user_id', $user->id))
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'photo_path']);

        $student = $request->route('student');

        return [
            'children' => $children,
            'activeStudentId' => $student instanceof Student ? $student->id : null,
        ];
    }
}
