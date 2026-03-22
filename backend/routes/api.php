<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TwoFactorController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-student', [AuthController::class, 'registerStudent']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 2FA (available to all authenticated users)
    Route::get('/user/two-factor-status', [TwoFactorController::class, 'status']);
    Route::post('/user/two-factor-authentication', [TwoFactorController::class, 'enable']);
    Route::post('/user/confirmed-two-factor-authentication', [TwoFactorController::class, 'confirm']);
    Route::delete('/user/two-factor-authentication', [TwoFactorController::class, 'disable']);
    Route::get('/user/two-factor-qr-code', [TwoFactorController::class, 'qrCode']);
    Route::get('/user/two-factor-recovery-codes', [TwoFactorController::class, 'recoveryCodes']);

    // Officer and admin routes
    Route::middleware('role:officer,admin')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/dashboard', [AuthController::class, 'dashboard']);
        Route::post('/user-profile-image', [AuthController::class, 'uploadUserProfileImage']);
        Route::put('/user-password', [AuthController::class, 'updateUserPassword']);
        Route::get('/users', [AuthController::class, 'getUsers']);
        Route::get('/users/archived', [AuthController::class, 'getArchivedUsers']);
        Route::put('/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{id}', [AuthController::class, 'archiveUser']);
        Route::post('/users/{id}/restore', [AuthController::class, 'restoreUser']);

        // Students
        Route::get('/students', [StudentController::class, 'index']);
        Route::post('/students', [StudentController::class, 'store']);
        Route::get('/students/search', [StudentController::class, 'search']);
        Route::get('/students/faces', [StudentController::class, 'getFaceData']);
        Route::get('/students/archived', [StudentController::class, 'archived']);
        Route::get('/students/{id}', [StudentController::class, 'show']);
        Route::put('/students/{id}', [StudentController::class, 'update']);
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);
        Route::post('/students/{id}/restore', [StudentController::class, 'restore']);
        Route::post('/students/{id}/face', [StudentController::class, 'saveFaceData']);

        // Events
        Route::get('/events', [EventController::class, 'index']);
        Route::post('/events', [EventController::class, 'store']);
        Route::get('/events/active', [EventController::class, 'active']);
        Route::get('/events/{id}', [EventController::class, 'show']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        // Attendance
        Route::post('/checkin', [AttendanceController::class, 'processCheckin']);
        Route::get('/attendance/live/{eventId}', [AttendanceController::class, 'liveAttendance']);
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::get('/reports', [AttendanceController::class, 'reports']);

        // Audit Logs (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/audit-logs', [AuditLogController::class, 'index']);
        });
    });

    // Student routes
    Route::middleware('role:student')->group(function () {
        Route::get('/student-dashboard', [AuthController::class, 'studentDashboard']);
        Route::get('/student-attendance', [AuthController::class, 'studentAttendance']);
        Route::get('/student-events', [AuthController::class, 'studentEvents']);
        Route::get('/student-profile', [AuthController::class, 'studentProfile']);
        Route::put('/student-password', [AuthController::class, 'updateStudentPassword']);
        Route::post('/student-profile-image', [AuthController::class, 'uploadProfileImage']);
    });
});
