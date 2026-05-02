<?php

namespace App\Services\Dashboard;

use App\Models\Announcement;
use App\Models\AssessmentMark;
use App\Models\Invoice;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\User;
use App\Support\Tenant\TenantContext;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class TenantDashboardService
{
    public function __construct(private readonly TenantContext $tenant) {}

    /**
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $schoolId = null;

        if ($user->isSuperAdmin()) {
            $schoolId = $this->tenant->school?->id;
        } else {
            $schoolId = $user->school_id;
        }

        if ($schoolId === null) {
            return [
                'scope' => 'platform',
                'metrics' => [
                    'students' => 0,
                    'staff' => 0,
                    'open_invoices' => 0,
                    'attendance_today' => 0,
                    'recent_announcements' => 0,
                ],
                'trends' => [
                    'finance' => [],
                    'attendance' => [],
                ],
            ];
        }

        return Cache::remember(
            sprintf('dash:%s:%s', $schoolId, Carbon::today()->toDateString()),
            120,
            function () use ($schoolId): array {
                $todayRecords = StudentAttendanceRecord::whereHas('attendanceSession', fn ($query) => $query
                    ->where('school_id', $schoolId)
                    ->whereDate('date', Carbon::today())
                )->get();

                return [
                    'scope' => 'school',
                    'school_id' => $schoolId,
                    'metrics' => [
                        'students' => Student::where('school_id', $schoolId)->where('status', 'active')->count(),
                        'staff' => User::where('school_id', $schoolId)->count(),
                        'open_invoices' => Invoice::where('school_id', $schoolId)->whereNotIn('status', ['paid', 'void'])->count(),
                        'attendance_today' => [
                            'total' => $todayRecords->count(),
                            'absent' => $todayRecords->where('status', 'absent')->count(),
                            'late' => $todayRecords->where('status', 'late')->count(),
                        ],
                        'recent_announcements' => Announcement::where('school_id', $schoolId)
                            ->latest()
                            ->take(5)
                            ->count(),
                    ],
                    'trends' => [
                        'attendance_week' => $this->attendanceSnapshots($schoolId),
                        'grade_updates' => AssessmentMark::where('school_id', $schoolId)->latest()->take(10)->count(),
                    ],
                ];
            }
        );
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    protected function attendanceSnapshots(int $schoolId): array
    {
        $snapshot = [];

        foreach (Carbon::today()->subDays(6)->daysUntil(Carbon::today()->endOfDay()) as $date) {
            $snapshot[] = [
                'date' => $date->toDateString(),
                'present' => StudentAttendanceRecord::whereHas('attendanceSession', fn ($query) => $query
                    ->where('school_id', $schoolId)
                    ->whereDate('date', $date))->where('status', 'present')->count(),
            ];
        }

        return $snapshot;
    }
}
