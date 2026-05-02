<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\AbsenteeGuardianNotifier;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\StudentAttendanceSession;
use App\Support\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceApiController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'class_group_id' => ['required', 'exists:class_groups,id'],
            'date' => ['required', 'date'],
            'method' => ['nullable', 'string', 'max:24'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => ['required', 'exists:students,id'],
            'records.*.status' => ['required', 'in:present,absent,late,excused'],
            'records.*.arrived_at' => ['nullable', 'date_format:Y-m-d\TH:i'],
            'records.*.notes' => ['nullable', 'string', 'max:500'],
        ]);

        /** @var ClassGroup|null $group */
        $group = ClassGroup::with('academicYear')->find($validated['class_group_id']);

        if ($group === null) {
            return ApiResponse::error(__('Class group unavailable.'), 404);
        }

        if (
            (! $request->user()->isSuperAdmin() && (int) $group->school_id !== (int) $request->user()->school_id)
            || (! $request->user()->hasAnyRole(['teacher', 'school_admin', 'super_admin']))
        ) {
            abort(403);
        }

        $sessionPayload = DB::transaction(function () use ($validated, $group, $request) {
            $session = StudentAttendanceSession::updateOrCreate(
                [
                    'class_group_id' => $group->id,
                    'date' => Carbon::parse($validated['date'])->startOfDay(),
                ],
                [
                    'school_id' => $group->school_id,
                    'academic_year_id' => $group->academic_year_id,
                    'marked_by' => $request->user()->id,
                    'method' => $validated['method'] ?? 'manual',
                    'source' => 'api:v1',
                ]
            );

            foreach ($validated['records'] as $row) {
                $student = Student::find($row['student_id']);

                if ($student === null || (int) $student->school_id !== (int) $group->school_id) {
                    continue;
                }

                StudentAttendanceRecord::updateOrCreate(
                    [
                        'session_id' => $session->id,
                        'student_id' => $student->id,
                    ],
                    [
                        'status' => $row['status'],
                        'arrived_at' => isset($row['arrived_at']) ? Carbon::parse($row['arrived_at']) : null,
                        'notes' => $row['notes'] ?? null,
                    ]
                );

                if (($row['status'] ?? '') === 'absent') {
                    AbsenteeGuardianNotifier::dispatch((int) $student->id, (string) Carbon::parse($validated['date'])->toDateString())
                        ->onQueue('notifications');
                }
            }

            return $session->load('records');
        });

        return ApiResponse::success([
            'session_id' => $sessionPayload->id,
            'total' => $sessionPayload->records()->count(),
        ], message: __('Attendance synchronized'));
    }
}
