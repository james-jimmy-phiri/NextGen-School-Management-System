<?php

namespace App\Jobs;

use App\Models\Student;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AbsenteeGuardianNotifier implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $studentId, public string $date)
    {
        $this->onQueue(config('queue.default', 'database'));
    }

    public function handle(): void
    {
        /** @var Student|null $student */
        $student = Student::with('guardians')->find($this->studentId);

        if ($student === null) {
            return;
        }

        foreach ($student->guardians as $guardian) {
            Log::info('nextgen.attendance.absent_alert', [
                'student_admission_number' => $student->admission_number,
                'school_id' => $student->school_id,
                'guardian_contact' => $guardian->phone ?? $guardian->email,
                'date' => $this->date,
                'sms_ready' => true,
                'push_ready' => true,
            ]);
        }
    }
}
