<?php

namespace App\Services;

use App\Models\ClassGroup;
use App\Models\Invoice;
use App\Models\Student;
use App\Models\StudentEnrollment;
use Illuminate\Support\Facades\DB;

class StudentLifecycleService
{
    /**
     * @param  list<int>  $studentIds
     * @param  list<int>  $repeatIds
     */
    public function promote(int $schoolId, array $studentIds, int $toClassGroupId, array $repeatIds = []): int
    {
        $destination = ClassGroup::query()
            ->where('school_id', $schoolId)
            ->findOrFail($toClassGroupId);

        $count = 0;

        DB::transaction(function () use ($schoolId, $studentIds, $destination, $repeatIds, &$count) {
            $students = Student::query()
                ->where('school_id', $schoolId)
                ->whereIn('id', $studentIds)
                ->with(['enrollments' => fn ($q) => $q->latest('id')])
                ->get();

            foreach ($students as $student) {
                if (in_array($student->id, $repeatIds, true)) {
                    $count++;
                    continue;
                }

                $current = $student->enrollments->first();
                if ($current && (int) $current->academic_year_id !== (int) $destination->academic_year_id) {
                    $current->update([
                        'status' => 'promoted',
                        'promoted_at' => now(),
                    ]);
                }

                StudentEnrollment::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'academic_year_id' => $destination->academic_year_id,
                    ],
                    [
                        'school_id' => $schoolId,
                        'class_group_id' => $destination->id,
                        'campus_id' => $destination->campus_id,
                        'status' => 'enrolled',
                    ]
                );

                $count++;
            }
        });

        return $count;
    }

    /**
     * @param  array{fees?: bool, library?: bool, stores?: bool}  $clearance
     */
    public function transferOut(Student $student, string $reason, array $clearance, ?string $destination = null): void
    {
        DB::transaction(function () use ($student, $reason, $clearance, $destination) {
            $student->update([
                'status' => 'transferred',
                'status_reason' => $reason,
                'left_on' => now()->toDateString(),
            ]);

            $student->transfers()->create([
                'school_id' => $student->school_id,
                'direction' => 'out',
                'reason' => $reason,
                'effective_on' => now()->toDateString(),
                'meta' => [
                    'destination' => $destination,
                    'clearance' => [
                        'fees' => (bool) ($clearance['fees'] ?? false),
                        'library' => (bool) ($clearance['library'] ?? false),
                        'stores' => (bool) ($clearance['stores'] ?? false),
                    ],
                    'outstanding_balance' => Invoice::query()
                        ->where('student_id', $student->id)
                        ->where('balance_due', '>', 0)
                        ->sum('balance_due'),
                ],
            ]);
        });
    }

    public function graduate(Student $student, ?string $reason = null): void
    {
        $student->update([
            'status' => 'graduated',
            'status_reason' => $reason,
            'left_on' => now()->toDateString(),
        ]);
    }

    public function withdraw(Student $student, string $reason): void
    {
        $student->update([
            'status' => 'withdrawn',
            'status_reason' => $reason,
            'left_on' => now()->toDateString(),
        ]);
    }

    public function outstandingBalance(Student $student): float
    {
        return (float) Invoice::query()
            ->where('student_id', $student->id)
            ->where('balance_due', '>', 0)
            ->sum('balance_due');
    }
}
