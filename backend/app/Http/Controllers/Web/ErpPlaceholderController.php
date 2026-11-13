<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ErpPlaceholderController extends Controller
{
    public function show(Request $request, string $pageKey): Response
    {
        $definitions = config('erp_pages.definitions', []);
        $page = $definitions[$pageKey] ?? null;

        abort_if($page === null, 404);

        $this->authorizePageAccess($request, $pageKey);

        $component = $page['component'] ?? 'Scaffold/ModulePage';
        $payload = array_merge(
            [
                'pageKey' => $pageKey,
                'title' => $page['title'] ?? 'Module',
                'description' => $page['description'] ?? '',
                'features' => $page['features'] ?? [],
                'breadcrumbs' => $page['breadcrumbs'] ?? [],
            ],
            $page['props'] ?? [],
        );

        return Inertia::render($component, $payload);
    }

    protected function authorizePageAccess(Request $request, string $pageKey): void
    {
        $user = $request->user();

        if (str_starts_with($pageKey, 'superadmin-')) {
            abort_unless($user->isSuperAdmin(), 403, 'Platform Super Administrator privilege required.');
            return;
        }

        if (str_starts_with($pageKey, 'portal-')) {
            abort_unless($user->hasRole('parent'), 403, 'Parent portal access required.');
            return;
        }

        // All remaining operational ERP pages require a school context
        abort_unless($user->school_id !== null, 403, 'An active school context is required to access this module.');

        if (str_starts_with($pageKey, 'finance-')) {
            abort_unless(
                $user->can('finance.view') || $user->can('finance.manage') || $user->hasAnyRole(['accountant', 'school_director', 'school_admin']),
                403,
                'You do not have permission to view or manage finances.'
            );
        } elseif (str_starts_with($pageKey, 'school-')) {
            abort_unless(
                $user->can('school_setup.view') || $user->can('school.manage') || $user->hasAnyRole(['school_director', 'school_admin']),
                403,
                'You do not have permission to access school setup.'
            );
        } elseif (str_starts_with($pageKey, 'students-')) {
            abort_unless(
                $user->can('students.view') || $user->hasAnyRole(['school_director', 'school_admin', 'teacher', 'accountant', 'registrar']),
                403,
                'You do not have permission to access student records.'
            );
        } elseif (str_starts_with($pageKey, 'academics-')) {
            abort_unless(
                $user->can('assessments.view') || $user->can('academics.classes.manage') || $user->hasAnyRole(['teacher', 'school_director', 'school_admin']),
                403,
                'You do not have permission to access academic records.'
            );
        } elseif (str_starts_with($pageKey, 'attendance-')) {
            abort_unless(
                $user->can('attendance.view') || $user->can('attendance.manage') || $user->hasAnyRole(['teacher', 'school_director', 'school_admin']),
                403,
                'You do not have permission to view or manage attendance.'
            );
        } elseif (str_starts_with($pageKey, 'staff-')) {
            abort_unless(
                $user->hasAnyRole(['school_director', 'school_admin']),
                403,
                'Staff management is restricted to school leadership.'
            );
        } elseif (str_starts_with($pageKey, 'library-')) {
            abort_unless(
                $user->can('library.view') || $user->can('library.manage') || $user->hasAnyRole(['librarian', 'school_director', 'school_admin']),
                403,
                'Library access permission required.'
            );
        } elseif (str_starts_with($pageKey, 'health-')) {
            abort_unless(
                $user->can('health.view') || $user->can('health.manage') || $user->hasAnyRole(['nurse', 'school_director', 'school_admin']),
                403,
                'Health center access permission required.'
            );
        } elseif (str_starts_with($pageKey, 'discipline-')) {
            abort_unless(
                $user->hasAnyRole(['teacher', 'school_director', 'school_admin']),
                403,
                'Discipline records are restricted to teachers and administrators.'
            );
        } elseif (str_starts_with($pageKey, 'settings-')) {
            abort_unless(
                $user->can('settings.manage') || $user->hasAnyRole(['school_director', 'school_admin']),
                403,
                'Settings management is restricted to school leadership.'
            );
        }
    }
}
