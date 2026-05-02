<?php

use App\Http\Controllers\Api\V1\AttendanceApiController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardApiController;
use App\Http\Controllers\Api\V1\SchoolApiController;
use App\Http\Controllers\Api\V1\StudentApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('resolve.tenant')->group(function (): void {
    Route::post('auth/token', [AuthController::class, 'token'])
        ->middleware('throttle:login');

    Route::middleware(['auth:sanctum'])->group(function (): void {
        Route::delete('auth/token', [AuthController::class, 'destroy']);
        Route::get('auth/profile', [AuthController::class, 'profile']);

        Route::get('dashboard', DashboardApiController::class);

        Route::get('schools', [SchoolApiController::class, 'index']);
        Route::post('schools', [SchoolApiController::class, 'store']);
        Route::patch('schools/{school}', [SchoolApiController::class, 'update']);

        Route::get('students', [StudentApiController::class, 'index']);
        Route::post('students', [StudentApiController::class, 'store']);
        Route::get('students/{student}', [StudentApiController::class, 'show']);

        Route::post('attendance/sync', [AttendanceApiController::class, 'sync']);
    });
});
