<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\StudentAttendanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(
            $request->user()->hasAnyRole(['teacher', 'school_admin', 'super_admin']),
            403
        );

        $schoolId = $request->user()->isSuperAdmin() ? null : $request->user()->school_id;

        $latest = [];

        if ($schoolId !== null) {
            $latest = StudentAttendanceRecord::with(['student', 'attendanceSession.classGroup'])
                ->whereHas('attendanceSession', fn ($query) => $query->where('school_id', $schoolId))
                ->latest()
                ->take(15)
                ->get();
        }

        return Inertia::render('Attendance/Index', [
            'latest' => $latest,
            'capabilities' => [
                'supports_qr' => true,
                'supports_biometric' => true,
                'supports_nfc' => true,
            ],
        ]);
    }
}
