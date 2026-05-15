<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\AttendanceController;
use App\Http\Controllers\Web\AuditLogController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ErpPlaceholderController;
use App\Http\Controllers\Web\ParentPortalController;
use App\Http\Controllers\Web\PermissionController;
use App\Http\Controllers\Web\RoleController;
use App\Http\Controllers\Web\SchoolController;
use App\Http\Controllers\Web\StudentController;
use App\Http\Controllers\Web\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'resolve.tenant'])->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/dashboard/analytics', static fn () => Inertia::render('Dashboard/Analytics'))->name('dashboard.analytics');
    Route::get('/dashboard/activity', static fn () => Inertia::render('Dashboard/Activity'))->name('dashboard.activity');

    Route::get('/app/{pageKey}', [ErpPlaceholderController::class, 'show'])
        ->where('pageKey', '[a-z0-9\-]+')
        ->name('erp.page');

    Route::get('/schools', [SchoolController::class, 'index'])->name('schools.index');
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

    // ─── Identity & access (users, roles, permissions — Spatie RBAC) ────────
    Route::resource('users', UserManagementController::class)->except(['show']);

    Route::get('/permissions/create', [PermissionController::class, 'create'])
        ->middleware('permission:roles.manage')
        ->name('permissions.create');
    Route::post('/permissions', [PermissionController::class, 'store'])
        ->middleware('permission:roles.manage')
        ->name('permissions.store');
    Route::get('/permissions', [PermissionController::class, 'index'])
        ->middleware('permission:users.view')
        ->name('permissions.index');

    Route::middleware('permission:roles.manage')->group(function (): void {
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::patch('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        Route::post('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name(
            'roles.update-permissions',
        );
    });

    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('permission:audit.view')
        ->name('audit-logs.index');

    Route::get('/school-setup', [\App\Http\Controllers\Web\SchoolSetupController::class, 'index'])
        ->middleware('permission:school_setup.view')
        ->name('school-setup.index');

    Route::get('/portal/parent', ParentPortalController::class)
        ->middleware('role:parent')
        ->name('portal.parent');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
