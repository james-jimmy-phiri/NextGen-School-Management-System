<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Invoice;
use App\Models\SchoolCalendarEvent;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParentDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $students = Student::query()
            ->whereHas('guardians', fn ($query) => $query->where('user_id', $user->id))
            ->with(['enrollments.classGroup.academicYear', 'school'])
            ->latest()
            ->get();

        $students->transform(function ($student) {
            $thirtyDaysAgo = now()->subDays(30);

            $records = StudentAttendanceRecord::query()
                ->where('student_id', $student->id)
                ->where('created_at', '>=', $thirtyDaysAgo)
                ->get();

            if ($records->isNotEmpty()) {
                $present = $records->whereIn('status', ['present', 'late'])->count();
                $total = $records->count();
                $student->attendance_summary = [
                    'percentage' => $total > 0 ? (int) round(($present / $total) * 100) : null,
                    'present' => $records->where('status', 'present')->count(),
                    'absent' => $records->where('status', 'absent')->count(),
                    'late' => $records->where('status', 'late')->count(),
                ];
            } else {
                $student->attendance_summary = [
                    'percentage' => null,
                    'present' => 0,
                    'absent' => 0,
                    'late' => 0,
                ];
            }

            $balanceDue = Invoice::query()
                ->where('student_id', $student->id)
                ->sum('balance_due');

            $student->finance_summary = [
                'balance_due' => (float) $balanceDue,
                'currency' => $student->school?->currency ?? 'MWK',
            ];

            $latestAverage = \App\Models\AssessmentMark::where('student_id', $student->id)->avg('score');
            $student->academic_summary = ['latest_average' => $latestAverage !== null ? round($latestAverage) : null];

            $pointsDeducted = \App\Models\DisciplineRecord::where('student_id', $student->id)->sum('points_deducted');
            $student->behaviour_summary = ['points' => 100 - $pointsDeducted];

            return $student;
        });

        $announcements = Announcement::query()
            ->where('school_id', $user->school_id)
            ->latest()
            ->take(3)
            ->get();

        $events = SchoolCalendarEvent::query()
            ->where('school_id', $user->school_id)
            ->where('start_date', '>=', now()->toDateString())
            ->orderBy('start_date')
            ->take(3)
            ->get();

        return Inertia::render('Portal/Dashboard', [
            'students' => $students,
            'announcements' => $announcements,
            'events' => $events,
        ]);
    }
}
