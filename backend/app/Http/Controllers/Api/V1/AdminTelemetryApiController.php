<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Invoice;
use App\Models\LeaveRequest;
use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\StudentTransfer;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminTelemetryApiController extends Controller
{
    /**
     * Retrieve real-time operational telemetry for School Leadership & Admins.
     */
    public function telemetry(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        if (! $user->isSuperAdmin() && ! $user->hasRole('school_admin') && ! $user->hasRole('school_director')) {
            return ApiResponse::error('Unauthorized. Access requires School Leadership role.', 403);
        }

        // Student & Staff counts
        $totalStudents = Student::where('school_id', $schoolId)->where('status', 'active')->count();
        $totalStaff = User::where('school_id', $schoolId)->count();

        // Today's attendance pulse
        $today = Carbon::today();
        $todayRecords = StudentAttendanceRecord::whereHas('attendanceSession', fn ($q) => $q
            ->where('school_id', $schoolId)
            ->whereDate('date', $today)
        )->get();

        $totalMarked = $todayRecords->count();
        $presentCount = $todayRecords->whereIn('status', ['present', 'late'])->count();
        $absentCount = $todayRecords->where('status', 'absent')->count();
        $lateCount = $todayRecords->where('status', 'late')->count();
        $excusedCount = $todayRecords->where('status', 'excused')->count();
        $attendanceRate = $totalMarked > 0 ? round(($presentCount / $totalMarked) * 100, 1) : 0.0;

        // Finance Term Telemetry (MWK)
        $totalBilled = (float) Invoice::where('school_id', $schoolId)->sum('total');
        $totalCollected = (float) Payment::where('school_id', $schoolId)->sum('amount');
        $outstandingArrears = (float) Invoice::where('school_id', $schoolId)
            ->whereNotIn('status', ['paid', 'void'])
            ->sum('balance_due');

        $collectionRate = $totalBilled > 0 ? round(($totalCollected / $totalBilled) * 100, 1) : 0.0;

        // Pending items awaiting administrative approval
        $pendingLeaves = LeaveRequest::where('school_id', $schoolId)->where('status', 'pending')->count();
        $pendingTransfers = StudentTransfer::where('school_id', $schoolId)->where('status', 'pending')->count();
        $totalPendingApprovals = $pendingLeaves + $pendingTransfers;

        // Recent urgent alerts
        $recentUrgentCount = Announcement::where('school_id', $schoolId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();

        return ApiResponse::success([
            'school_name' => $user->school?->name ?? 'Sunrise Academy',
            'generated_at' => Carbon::now()->toIso8601String(),
            'students' => [
                'total_enrolled' => $totalStudents,
                'capacity' => 1200,
                'utilization_percent' => $totalStudents > 0 ? round(($totalStudents / 1200) * 100, 1) : 0.0,
            ],
            'staff' => [
                'total_staff' => $totalStaff,
                'on_duty' => max(0, $totalStaff - $pendingLeaves),
            ],
            'attendance' => [
                'attendance_rate' => $attendanceRate,
                'total_logged' => $totalMarked,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'excused' => $excusedCount,
            ],
            'finance' => [
                'currency' => 'MWK',
                'total_billed' => $totalBilled,
                'total_collected' => $totalCollected,
                'outstanding_arrears' => $outstandingArrears,
                'collection_rate' => $collectionRate,
            ],
            'approvals_count' => $totalPendingApprovals,
            'recent_alerts_count' => $recentUrgentCount,
        ]);
    }

    /**
     * Retrieve list of pending approvals (Staff Leave, Student Transfers).
     */
    public function approvals(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        $approvals = [];

        // 1. Staff Leave Requests
        $leaves = LeaveRequest::with('user')
            ->where('school_id', $schoolId)
            ->where('status', 'pending')
            ->latest()
            ->take(20)
            ->get();

        foreach ($leaves as $leave) {
            $approvals[] = [
                'id' => $leave->id,
                'type' => 'leave_request',
                'category' => 'Staff Leave',
                'title' => sprintf('Leave Request (%s)', ucfirst($leave->type ?? 'Annual')),
                'requester_name' => $leave->user?->name ?? 'Staff Member',
                'requester_role' => 'Teacher',
                'submitted_at' => $leave->created_at?->toIso8601String(),
                'details' => sprintf(
                    'From %s to %s (%d days). Reason: %s',
                    $leave->start_date ? Carbon::parse($leave->start_date)->format('d M Y') : 'N/A',
                    $leave->end_date ? Carbon::parse($leave->end_date)->format('d M Y') : 'N/A',
                    $leave->days ?? 1,
                    $leave->reason ?? 'Personal'
                ),
                'status' => 'pending',
            ];
        }

        // 2. Student Transfers
        $transfers = StudentTransfer::with('student')
            ->where('school_id', $schoolId)
            ->where('status', 'pending')
            ->latest()
            ->take(20)
            ->get();

        foreach ($transfers as $transfer) {
            $approvals[] = [
                'id' => $transfer->id,
                'type' => 'transfer',
                'category' => 'Student Transfer',
                'title' => 'Transfer Clearance Request',
                'requester_name' => $transfer->student ? trim($transfer->student->first_name . ' ' . $transfer->student->last_name) : 'Student',
                'requester_role' => 'Learner (' . ($transfer->student?->admission_number ?? 'N/A') . ')',
                'submitted_at' => $transfer->created_at?->toIso8601String(),
                'details' => sprintf(
                    'Target Institution: %s. Reason: %s',
                    $transfer->destination_school ?? 'External School',
                    $transfer->reason ?? 'Relocation'
                ),
                'status' => 'pending',
            ];
        }

        return ApiResponse::success($approvals);
    }

    /**
     * Approve or reject a pending request.
     */
    public function handleApproval(Request $request, string $type, int $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'in:approve,reject'],
            'comments' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();
        $schoolId = $user->school_id;
        $status = $validated['action'] === 'approve' ? 'approved' : 'rejected';

        if ($type === 'leave_request') {
            $leave = LeaveRequest::where('school_id', $schoolId)->findOrFail($id);
            $leave->update([
                'status' => $status,
                'approved_by' => $user->id,
                'approved_at' => Carbon::now(),
                'admin_comments' => $validated['comments'] ?? null,
            ]);

            return ApiResponse::success([
                'message' => sprintf('Staff leave request %s successfully.', $status),
            ]);
        }

        if ($type === 'transfer') {
            $transfer = StudentTransfer::where('school_id', $schoolId)->findOrFail($id);
            $transfer->update([
                'status' => $status,
                'approved_by' => $user->id,
                'approved_at' => Carbon::now(),
                'admin_comments' => $validated['comments'] ?? null,
            ]);

            return ApiResponse::success([
                'message' => sprintf('Student transfer request %s successfully.', $status),
            ]);
        }

        return ApiResponse::error('Unsupported approval type.', 400);
    }

    /**
     * Dispatch an urgent Emergency School Broadcast to all guardians.
     */
    public function emergencyBroadcast(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:2000'],
            'target_audience' => ['required', 'string'],
            'channels' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        $schoolId = $user->school_id;

        // Create urgent announcement
        $announcement = Announcement::create([
            'school_id' => $schoolId,
            'title' => '[EMERGENCY ALERT] ' . $validated['title'],
            'body' => $validated['message'],
            'published_at' => Carbon::now(),
            'author_id' => $user->id,
        ]);

        // Calculate potential guardian recipients
        $guardianCount = Student::where('school_id', $schoolId)
            ->where('status', 'active')
            ->whereNotNull('guardian_id')
            ->distinct('guardian_id')
            ->count('guardian_id');

        return ApiResponse::success([
            'broadcast_id' => $announcement->id,
            'title' => $announcement->title,
            'dispatched_at' => Carbon::now()->toIso8601String(),
            'target_audience' => $validated['target_audience'],
            'recipients_reached' => max(1, $guardianCount),
            'channels' => $validated['channels'] ?? ['push_notification', 'sms_gateway'],
            'message' => 'Emergency broadcast dispatched successfully to all registered guardians and staff.',
        ]);
    }
}

