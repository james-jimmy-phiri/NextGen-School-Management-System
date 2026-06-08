<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\StudentAttendanceSession;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('attendance.view') || $request->user()->can('attendance.manage'), 403);

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
                'supports_qr' => false,
                'supports_biometric' => false,
                'supports_nfc' => false,
            ],
        ]);
    }

    public function mark(Request $request)
    {
        abort_unless($request->user()->can('attendance.manage'), 403);

        $schoolId = $request->user()->school_id;
        $date = $request->query('date', now()->toDateString());
        $classGroupId = $request->query('class_group_id');

        $classes = ClassGroup::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderBy('name')
            ->get(['id', 'name']);

        $students = collect();
        $existing = collect();
        $session = null;

        if ($classGroupId) {
            $currentYear = AcademicYear::query()
                ->where('school_id', $schoolId)
                ->where('is_current', true)
                ->first();

            $enrolledIds = StudentEnrollment::query()
                ->when($currentYear, fn ($q) => $q->where('academic_year_id', $currentYear->id))
                ->where('class_group_id', $classGroupId)
                ->pluck('student_id');

            $students = Student::query()
                ->whereIn('id', $enrolledIds)
                ->where('status', 'active')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'admission_number']);

            $session = StudentAttendanceSession::query()
                ->where('school_id', $schoolId)
                ->where('class_group_id', $classGroupId)
                ->whereDate('date', $date)
                ->first();

            if ($session) {
                $existing = $session->records()->get()->keyBy('student_id');
            }
        }

        return Inertia::render('Attendance/Mark', [
            'classes' => $classes,
            'students' => $students,
            'existing' => $existing,
            'session' => $session,
            'filters' => [
                'date' => $date,
                'class_group_id' => $classGroupId,
            ],
        ]);
    }

    public function storeSession(Request $request)
    {
        abort_unless($request->user()->can('attendance.manage'), 403);

        $validated = $request->validate([
            'class_group_id' => 'required|exists:class_groups,id',
            'date' => 'required|date',
            'records' => 'required|array|min:1',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|string|in:present,absent,late,excused',
            'records.*.notes' => 'nullable|string|max:500',
        ]);

        $schoolId = $request->user()->school_id;
        $classGroup = ClassGroup::findOrFail($validated['class_group_id']);
        abort_unless($classGroup->school_id === $schoolId, 403);

        $academicYear = AcademicYear::query()
            ->where('school_id', $schoolId)
            ->where('is_current', true)
            ->first();

        DB::transaction(function () use ($request, $validated, $schoolId, $academicYear) {
            $session = StudentAttendanceSession::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'class_group_id' => $validated['class_group_id'],
                    'date' => $validated['date'],
                ],
                [
                    'academic_year_id' => $academicYear?->id,
                    'marked_by' => $request->user()->id,
                    'method' => 'manual',
                    'source' => 'web',
                ]
            );

            foreach ($validated['records'] as $record) {
                StudentAttendanceRecord::updateOrCreate(
                    [
                        'session_id' => $session->id,
                        'student_id' => $record['student_id'],
                    ],
                    [
                        'status' => $record['status'],
                        'notes' => $record['notes'] ?? null,
                    ]
                );
            }
        });

        return redirect()->route('attendance.mark', [
            'class_group_id' => $validated['class_group_id'],
            'date' => $validated['date'],
        ])->with('success', 'Attendance saved successfully.');
    }
}
