<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\AttendanceController;
use App\Http\Controllers\Web\AuditLogController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ErpPlaceholderController;
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
        'schools' => \App\Models\School::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'city', 'country']),
    ]);
});

// Legacy apply URL → school admissions wizard
Route::get('/apply/{school:slug?}', [App\Http\Controllers\Web\StudentRegistrationController::class, 'create'])->name('apply.create');
Route::post('/apply', [App\Http\Controllers\Web\StudentRegistrationController::class, 'store'])->name('apply.store');

// Public Admissions Module (school-branded)
Route::get('/admissions/apply/{school:slug?}', [App\Http\Controllers\PublicAdmissionController::class, 'create'])->name('public.admissions.create');
Route::post('/admissions/apply', [App\Http\Controllers\PublicAdmissionController::class, 'store'])->name('public.admissions.store');
Route::get('/admissions/track', [App\Http\Controllers\PublicAdmissionController::class, 'track'])->name('public.admissions.track');

Route::middleware(['auth', 'resolve.tenant'])->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/dashboard/analytics', static fn () => Inertia::render('Dashboard/Analytics'))->name('dashboard.analytics');
    Route::get('/dashboard/activity', static fn () => Inertia::render('Dashboard/Activity'))->name('dashboard.activity');

    Route::get('/app/{pageKey}', [ErpPlaceholderController::class, 'show'])
        ->where('pageKey', '[a-z0-9\-]+')
        ->name('erp.page');

    Route::resource('schools', SchoolController::class)->except(['show']);
    Route::resource('students', StudentController::class);
    Route::resource('guardians', \App\Http\Controllers\Web\GuardianController::class);
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

    // Admin Admissions Module
    Route::get('/admissions', [\App\Http\Controllers\AdmissionController::class, 'index'])->name('admissions.index');
    Route::get('/admissions/create', [\App\Http\Controllers\AdmissionController::class, 'create'])->name('admissions.create');
    Route::post('/admissions', [\App\Http\Controllers\AdmissionController::class, 'store'])->name('admissions.store');
    Route::get('/admissions/{admission}', [\App\Http\Controllers\AdmissionController::class, 'show'])->name('admissions.show');
    Route::patch('/admissions/{admission}/status', [\App\Http\Controllers\AdmissionController::class, 'updateStatus'])->name('admissions.updateStatus');
    Route::post('/admissions/{admission}/enroll', [\App\Http\Controllers\AdmissionController::class, 'enroll'])->name('admissions.enroll');

    // Portal Administrative Modules
    Route::resource('timetables', \App\Http\Controllers\Web\TimetableController::class)->except(['show', 'create', 'edit']);
    Route::resource('clinic-visits', \App\Http\Controllers\Web\ClinicVisitController::class)->except(['show', 'create', 'edit']);
    Route::resource('student-awards', \App\Http\Controllers\Web\StudentAwardController::class)->except(['show', 'create', 'edit']);

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

    // --- Academics Module ---
    Route::prefix('academics')->name('academics.')->group(function (): void {
        // Subjects — read-only listing & operational management (create/edit/delete is in School Setup)
        Route::get('/subjects', [\App\Http\Controllers\Web\AcademicsController::class, 'subjectsIndex'])->name('subjects.index');
        Route::get('/subjects/{id}', [\App\Http\Controllers\Web\AcademicsController::class, 'subjectManage'])->name('subjects.manage');

        // Classes — read-only listing & operational management (create/edit/delete is in School Setup)
        Route::get('/classes', [\App\Http\Controllers\Web\AcademicsController::class, 'classesIndex'])->name('classes.index');
        Route::get('/classes/{id}', [\App\Http\Controllers\Web\AcademicsController::class, 'classManage'])->name('classes.manage');

        // Operational: assign subjects to a class, assign teachers, manage student enrolments
        Route::post('/classes/{id}/subjects', [\App\Http\Controllers\Web\AcademicsController::class, 'assignSubjectsToClass'])->name('classes.subjects.assign');
        Route::post('/classes/{classId}/teachers', [\App\Http\Controllers\Web\AcademicsController::class, 'assignTeacherToSubject'])->name('classes.teachers.assign');
        Route::delete('/allocations/{id}', [\App\Http\Controllers\Web\AcademicsController::class, 'removeTeacherAssignment'])->name('allocations.destroy');
        Route::post('/students/{studentId}/subjects', [\App\Http\Controllers\Web\AcademicsController::class, 'enrollStudentSubject'])->name('students.subjects.enroll');
        Route::delete('/students/{studentId}/subjects/{subjectId}', [\App\Http\Controllers\Web\AcademicsController::class, 'dropStudentSubject'])->name('students.subjects.drop');
    });


    // --- Parent Portal ---
    Route::middleware('role:parent')->prefix('portal')->name('portal.')->group(function () {
        Route::get('/parent', \App\Http\Controllers\Web\ParentDashboardController::class)->name('parent');
        
        // Children Routes
        Route::get('/children/{student}', [\App\Http\Controllers\Web\Portal\PortalChildController::class, 'show'])->name('children.show');
        Route::get('/children/{student}/attendance', [\App\Http\Controllers\Web\Portal\PortalAttendanceController::class, 'show'])->name('children.attendance');
        Route::get('/children/{student}/academics', [\App\Http\Controllers\Web\Portal\PortalAcademicsController::class, 'show'])->name('children.academics');
        Route::get('/children/{student}/fees', [\App\Http\Controllers\Web\Portal\PortalFinanceController::class, 'show'])->name('children.fees');
        Route::get('/children/{student}/behaviour', [\App\Http\Controllers\Web\Portal\PortalBehaviourController::class, 'show'])->name('children.behaviour');
        Route::get('/children/{student}/health', [\App\Http\Controllers\Web\Portal\PortalHealthController::class, 'show'])->name('children.health');
        Route::get('/children/{student}/timetable', [\App\Http\Controllers\Web\Portal\PortalTimetableController::class, 'show'])->name('children.timetable');
        Route::get('/children/{student}/documents', [\App\Http\Controllers\Web\Portal\PortalDocumentsController::class, 'show'])->name('children.documents');

        // Global Portal Routes
        Route::get('/messages', [\App\Http\Controllers\Web\Portal\PortalMessagesController::class, 'index'])->name('messages');
        Route::post('/messages', [\App\Http\Controllers\Web\Portal\PortalMessagesController::class, 'store'])->name('messages.store');
        Route::get('/announcements', [\App\Http\Controllers\Web\Portal\PortalAnnouncementsController::class, 'index'])->name('announcements');
        Route::get('/calendar', [\App\Http\Controllers\Web\Portal\PortalCalendarController::class, 'index'])->name('calendar');
        Route::get('/profile', [\App\Http\Controllers\Web\Portal\PortalProfileController::class, 'show'])->name('profile');
        Route::patch('/profile', [\App\Http\Controllers\Web\Portal\PortalProfileController::class, 'update'])->name('profile.update');
    });
});

Route::middleware('auth')->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
