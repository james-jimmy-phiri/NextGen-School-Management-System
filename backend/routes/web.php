<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\AttendanceController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ParentPortalController;
use App\Http\Controllers\Web\SchoolController;
use App\Http\Controllers\Web\StudentController;
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

Route::middleware(['auth', 'verified', 'resolve.tenant'])->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/schools', [SchoolController::class, 'index'])->name('schools.index');
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

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
