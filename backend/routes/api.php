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
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
