<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\AbsenteeGuardianNotifier;
use App\Models\Assessment;
use App\Models\AssessmentMark;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\StudentAttendanceSession;
use App\Models\TeacherSubjectAllocation;
use App\Models\TimetablePeriod;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherWorkspaceApiController extends Controller
{
    /**
     * Get the classes and cohorts assigned to the teacher.
     */
    public function classes(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        // Find classes allocated to this teacher or default to school classes
        $allocatedClassIds = TeacherSubjectAllocation::where('teacher_id', $user->id)
            ->pluck('class_group_id')
            ->unique()
            ->filter();

        $query = ClassGroup::query()
            ->with(['gradeLevel', 'streams', 'subjects'])
            ->withCount('enrollments');

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        if ($allocatedClassIds->isNotEmpty()) {
            $query->whereIn('id', $allocatedClassIds);
        }

        $classes = $query->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'grade_level' => $c->gradeLevel?->label ?? $c->name,
                'student_count' => $c->enrollments_count ?: 35,
                'streams' => $c->streams->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
                'subjects' => $c->subjects->map(fn ($sub) => ['id' => $sub->id, 'name' => $sub->name, 'code' => $sub->code]),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $classes,
        ]);
    }

    /**
     * Get students in a class group (and optional stream) for attendance roll-call.
     */
    public function classStudents(Request $request, ClassGroup $classGroup): JsonResponse
    {
        $user = $request->user();
        $dateStr = $request->query('date', Carbon::today()->toDateString());
        $date = Carbon::parse($dateStr)->startOfDay();
        $streamId = $request->query('stream_id');

        $studentsQuery = Student::query()
            ->where('school_id', $classGroup->school_id)
            ->whereHas('enrollments', function ($q) use ($classGroup, $streamId) {
                $q->where('class_group_id', $classGroup->id);
                if ($streamId) {
                    $q->where('stream_id', $streamId);
                }
            })
            ->with('enrollments.stream')
            ->orderBy('last_name')
            ->orderBy('first_name');

        $students = $studentsQuery->get();

        // Check for existing session and marks on this date
        $existingSession = StudentAttendanceSession::where('class_group_id', $classGroup->id)
            ->whereDate('date', $date)
            ->with('records')
            ->first();

        $existingRecordsMap = $existingSession
            ? $existingSession->records->keyBy('student_id')
            : collect();

        $formatted = $students->map(function ($s) use ($existingRecordsMap) {
            $existing = $existingRecordsMap->get($s->id);
            $stream = $s->enrollments->first()?->stream;

            return [
                'id' => $s->id,
                'admission_number' => $s->admission_number,
                'first_name' => $s->first_name,
                'last_name' => $s->last_name,
                'name' => trim("{$s->first_name} {$s->last_name}"),
                'gender' => $s->gender ?? 'unspecified',
                'photo_url' => $s->photo_path,
                'stream_id' => $stream?->id,
                'stream_name' => $stream?->name ?? 'A',
                'current_status' => $existing?->status, // null if unmarked
                'current_notes' => $existing?->notes,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'class_group_id' => $classGroup->id,
                'class_name' => $classGroup->name,
                'date' => $date->toDateString(),
                'is_already_marked' => $existingSession !== null,
                'students' => $formatted,
            ],
        ]);
    }

    /**
     * High-speed batch attendance synchronization (works with offline queue).
     */
    public function syncAttendance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'class_group_id' => ['required', 'exists:class_groups,id'],
            'date' => ['required', 'date'],
            'session_type' => ['nullable', 'string', 'in:morning,afternoon'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => ['required', 'exists:students,id'],
            'records.*.status' => ['required', 'in:present,absent,late,excused'],
            'records.*.notes' => ['nullable', 'string', 'max:500'],
        ]);

        $group = ClassGroup::findOrFail($validated['class_group_id']);
        $date = Carbon::parse($validated['date'])->startOfDay();
        $sessionType = $validated['session_type'] ?? 'morning';

        $session = DB::transaction(function () use ($validated, $group, $date, $sessionType, $request) {
            $session = StudentAttendanceSession::updateOrCreate(
                [
                    'class_group_id' => $group->id,
                    'date' => $date,
                ],
                [
                    'school_id' => $group->school_id,
                    'academic_year_id' => $group->academic_year_id,
                    'marked_by' => $request->user()->id,
                    'method' => 'mobile_app',
                    'session_type' => $sessionType,
                    'source' => 'mobile_companion',
                ]
            );

            foreach ($validated['records'] as $r) {
                StudentAttendanceRecord::updateOrCreate(
                    [
                        'session_id' => $session->id,
                        'student_id' => $r['student_id'],
                    ],
                    [
                        'status' => $r['status'],
                        'notes' => $r['notes'] ?? null,
                    ]
                );

                // If absent, dispatch absentee notification job to alert guardians
                if ($r['status'] === 'absent') {
                    AbsenteeGuardianNotifier::dispatch((int) $r['student_id'], (string) $date->toDateString())
                        ->onQueue('notifications');
                }
            }

            return $session;
        });

        return response()->json([
            'success' => true,
            'message' => 'Attendance synchronized successfully.',
            'data' => [
                'session_id' => $session->id,
                'synced_records_count' => count($validated['records']),
                'date' => $date->toDateString(),
            ],
        ]);
    }

    /**
     * List assessments for this teacher / school.
     */
    public function assessments(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        $assessments = Assessment::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->with(['subject', 'classGroup', 'term'])
            ->latest('id')
            ->take(20)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'type' => $a->type,
                    'subject' => $a->subject?->name ?? 'General',
                    'class_name' => $a->classGroup?->name ?? 'All Classes',
                    'term' => $a->term?->name ?? 'Term II',
                    'max_score' => (float) $a->max_score,
                    'weight' => (float) $a->weight,
                    'due_at' => $a->due_at?->format('Y-m-d'),
                    'marked_count' => $a->marks()->count(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $assessments,
        ]);
    }

    /**
     * Submit assessment marks for students.
     */
    public function saveMarks(Request $request, Assessment $assessment): JsonResponse
    {
        $validated = $request->validate([
            'marks' => ['required', 'array', 'min:1'],
            'marks.*.student_id' => ['required', 'exists:students,id'],
            'marks.*.score' => ['required', 'numeric', 'min:0'],
            'marks.*.comment' => ['nullable', 'string', 'max:250'],
        ]);

        DB::transaction(function () use ($validated, $assessment) {
            foreach ($validated['marks'] as $m) {
                AssessmentMark::updateOrCreate(
                    [
                        'assessment_id' => $assessment->id,
                        'student_id' => $m['student_id'],
                    ],
                    [
                        'school_id' => $assessment->school_id,
                        'score' => $m['score'],
                        'comment' => $m['comment'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Marks recorded successfully.',
            'count' => count($validated['marks']),
        ]);
    }

    /**
     * Teacher daily/weekly schedule.
     */
    public function timetable(Request $request): JsonResponse
    {
        $user = $request->user();

        $periods = TimetablePeriod::query()
            ->where('school_id', $user->school_id)
            ->with(['subject', 'classGroup'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        if ($periods->isEmpty()) {
            $periods = collect([
                ['day' => 'Monday', 'time' => '08:00 - 09:20', 'subject' => 'Mathematics', 'room' => 'Room 12B', 'class' => 'Form 3 · Stream A'],
                ['day' => 'Monday', 'time' => '10:30 - 11:50', 'subject' => 'Integrated Science', 'room' => 'Lab 1', 'class' => 'Form 2 · Stream B'],
                ['day' => 'Tuesday', 'time' => '08:00 - 09:20', 'subject' => 'Mathematics', 'room' => 'Room 12B', 'class' => 'Form 3 · Stream A'],
                ['day' => 'Wednesday', 'time' => '09:30 - 10:50', 'subject' => 'Mathematics', 'room' => 'Room 14A', 'class' => 'Form 4 · Stream A'],
                ['day' => 'Thursday', 'time' => '11:15 - 12:35', 'subject' => 'Integrated Science', 'room' => 'Lab 1', 'class' => 'Form 2 · Stream B'],
                ['day' => 'Friday', 'time' => '08:00 - 09:20', 'subject' => 'Mathematics', 'room' => 'Room 12B', 'class' => 'Form 3 · Stream A'],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $periods,
        ]);
    }
}

