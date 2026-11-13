<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    // ─── Authentication ──────────────────────────────────────────────────────
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/token', [AuthController::class, 'token']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // School Configuration API Routes
        Route::prefix('school-setup')->name('api.school-setup.')->group(function () {
            Route::apiResource('school-profile', \App\Http\Controllers\Api\V1\SchoolProfileController::class);
            Route::apiResource('academic-years', \App\Http\Controllers\Api\V1\AcademicYearController::class);
            Route::apiResource('terms', \App\Http\Controllers\Api\V1\TermController::class);
            Route::apiResource('classes', \App\Http\Controllers\Api\V1\ClassGroupController::class);
            Route::apiResource('streams', \App\Http\Controllers\Api\V1\StreamController::class);
            Route::apiResource('subjects', \App\Http\Controllers\Api\V1\SubjectController::class);
            Route::apiResource('departments', \App\Http\Controllers\Api\V1\DepartmentController::class);
            Route::apiResource('grading-systems', \App\Http\Controllers\Api\V1\GradingSystemController::class);
        });

        // Parent Portal API Routes
        Route::prefix('portal')->name('api.portal.')->group(function () {
            Route::get('/children', [\App\Http\Controllers\Api\V1\ParentPortalApiController::class, 'children']);
            Route::get('/children/{student}/attendance', [\App\Http\Controllers\Api\V1\ParentPortalApiController::class, 'attendance']);
            Route::get('/children/{student}/academics', [\App\Http\Controllers\Api\V1\ParentPortalApiController::class, 'academics']);
            Route::get('/children/{student}/fees', [\App\Http\Controllers\Api\V1\ParentPortalApiController::class, 'fees']);
            Route::get('/children/{student}/timetable', [\App\Http\Controllers\Api\V1\ParentPortalApiController::class, 'timetable']);
        });

        // Teacher Workspace API Routes
        Route::prefix('teacher')->name('api.teacher.')->group(function () {
            Route::get('/classes', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'classes']);
            Route::get('/classes/{classGroup}/students', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'classStudents']);
            Route::post('/attendance/sync', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'syncAttendance']);
            Route::get('/assessments', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'assessments']);
            Route::post('/assessments/{assessment}/marks', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'saveMarks']);
            Route::get('/timetable', [\App\Http\Controllers\Api\V1\TeacherWorkspaceApiController::class, 'timetable']);
        });

        // Communication API Routes
        Route::prefix('communication')->name('api.communication.')->group(function () {
            Route::get('/announcements', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'announcements']);
            Route::get('/events', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'events']);
            Route::get('/messages', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'messages']);
            Route::post('/messages', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'sendMessage']);
            Route::get('/contacts', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'contacts']);
            Route::patch('/messages/{message}/read', [\App\Http\Controllers\Api\V1\CommunicationApiController::class, 'markAsRead']);
        });

        // Mobile Finance & Payments API Routes
        Route::prefix('finance')->name('api.finance.')->group(function () {
            Route::post('/pay-mobile-money', [\App\Http\Controllers\Api\V1\MobileFinanceApiController::class, 'payMobileMoney']);
            Route::get('/receipt/{reference}', [\App\Http\Controllers\Api\V1\MobileFinanceApiController::class, 'receipt']);
            Route::get('/history', [\App\Http\Controllers\Api\V1\MobileFinanceApiController::class, 'history']);
        });

        // Administrator Telemetry & Approvals API Routes
        Route::prefix('admin')->name('api.admin.')->group(function () {
            Route::get('/telemetry', [\App\Http\Controllers\Api\V1\AdminTelemetryApiController::class, 'telemetry']);
            Route::get('/approvals', [\App\Http\Controllers\Api\V1\AdminTelemetryApiController::class, 'approvals']);
            Route::post('/approvals/{type}/{id}', [\App\Http\Controllers\Api\V1\AdminTelemetryApiController::class, 'handleApproval']);
            Route::post('/emergency-broadcast', [\App\Http\Controllers\Api\V1\AdminTelemetryApiController::class, 'emergencyBroadcast']);
        });
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
