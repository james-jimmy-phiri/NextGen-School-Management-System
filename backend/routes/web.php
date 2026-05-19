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

    Route::resource('schools', SchoolController::class)->except(['show']);
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

    Route::middleware('permission:school_setup.view')->prefix('school-setup')->name('school-setup.')->group(function (): void {
        Route::get('/', [\App\Http\Controllers\Web\SchoolSetupController::class, 'index'])->name('index');
        Route::post('/school', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateSchool'])->name('school.update');

        Route::post('/academic-years', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeAcademicYear'])->name('academic-years.store');
        Route::patch('/academic-years/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateAcademicYear'])->name('academic-years.update');
        Route::delete('/academic-years/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyAcademicYear'])->name('academic-years.destroy');

        Route::post('/terms', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeTerm'])->name('terms.store');
        Route::patch('/terms/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateTerm'])->name('terms.update');
        Route::delete('/terms/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyTerm'])->name('terms.destroy');

        Route::post('/departments', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeDepartment'])->name('departments.store');
        Route::patch('/departments/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateDepartment'])->name('departments.update');
        Route::delete('/departments/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyDepartment'])->name('departments.destroy');

        Route::post('/grade-levels', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeGradeLevel'])->name('grade-levels.store');
        Route::patch('/grade-levels/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateGradeLevel'])->name('grade-levels.update');
        Route::delete('/grade-levels/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyGradeLevel'])->name('grade-levels.destroy');

        Route::post('/class-groups', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeClassGroup'])->name('class-groups.store');
        Route::patch('/class-groups/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateClassGroup'])->name('class-groups.update');
        Route::delete('/class-groups/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyClassGroup'])->name('class-groups.destroy');

        Route::post('/streams', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeStream'])->name('streams.store');
        Route::patch('/streams/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateStream'])->name('streams.update');
        Route::delete('/streams/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyStream'])->name('streams.destroy');

        Route::post('/subjects', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeSubject'])->name('subjects.store');
        Route::patch('/subjects/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateSubject'])->name('subjects.update');
        Route::delete('/subjects/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroySubject'])->name('subjects.destroy');

        Route::post('/grading-systems', [\App\Http\Controllers\Web\SchoolSetupController::class, 'storeGradingSystem'])->name('grading-systems.store');
        Route::patch('/grading-systems/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'updateGradingSystem'])->name('grading-systems.update');
        Route::delete('/grading-systems/{id}', [\App\Http\Controllers\Web\SchoolSetupController::class, 'destroyGradingSystem'])->name('grading-systems.destroy');
    });

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
