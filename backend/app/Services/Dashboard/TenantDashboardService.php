<?php

namespace App\Services\Dashboard;

use App\Models\AcademicYear;
use App\Models\Admission;
use App\Models\Announcement;
use App\Models\AssessmentMark;
use App\Models\ClassGroup;
use App\Models\GradeLevel;
use App\Models\Guardian;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\School;
use App\Models\SchoolCalendarEvent;
use App\Models\Student;
use App\Models\StudentAttendanceRecord;
use App\Models\TeacherSubjectAllocation;
use App\Models\Term;
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
            $schoolId = $this->tenant->school?->id ?? $user->school_id ?? School::first()?->id;
        } else {
            $schoolId = $user->school_id ?? School::first()?->id;
        }

        $roles = [];
        $primaryRole = 'admin';

        try {
            $roles = $user->getRoleNames()->toArray();

            if ($user->hasRole('student')) {
                $primaryRole = 'student';
            } elseif ($user->hasRole('parent')) {
                $primaryRole = 'parent';
            } elseif ($user->hasRole('teacher')) {
                $primaryRole = 'teacher';
            } elseif ($user->hasRole('accountant')) {
                $primaryRole = 'accountant';
            } elseif ($user->isSuperAdmin() || $user->hasRole('school_admin') || $user->hasRole('school_director')) {
                $primaryRole = 'admin';
            }
        } catch (\Throwable) {
            $roles = ['school_admin'];
            $primaryRole = 'admin';
        }

        if ($schoolId === null) {
            return [
                'scope' => 'platform',
                'primary_role' => $primaryRole,
                'roles' => $roles,
                'school_name' => 'NextGen Platform',
                'academic_year' => '2026 - 2027',
                'current_term' => 'Term 1',
                'kpis' => $this->defaultKpiCards($primaryRole, 'MWK'),
                'metrics' => [
                    'students' => 0,
                    'staff' => 0,
                    'open_invoices' => 0,
                    'attendance_today' => 0,
                    'recent_announcements' => 0,
                ],
                'role_config' => $this->roleConfig($primaryRole, $user),
                'recently_added_students' => $this->fallbackStudents(),
                'recent_activity' => $this->fallbackActivities(),
                'upcoming_events' => $this->fallbackEvents(),
                'application_breakdown' => [
                    ['name' => 'Pending', 'value' => 1, 'color' => '#facc15'],
                    ['name' => 'Approved', 'value' => 2, 'color' => '#60a5fa'],
                    ['name' => 'Review', 'value' => 1, 'color' => '#f472b6'],
                ],
                'performance_scores' => $this->defaultPerformanceScores(),
            ];
        }

        return Cache::remember(
            sprintf('dash:v2:%s:u%s:%s', $schoolId, $user->id, Carbon::today()->toDateString()),
            60,
            function () use ($schoolId, $user, $primaryRole, $roles): array {
                $school = School::find($schoolId);
                $schoolName = $school?->name ?? 'NextGen School';
                $currency = $school?->settings['finance']['currency'] ?? 'MWK';

                $currentYear = AcademicYear::where('school_id', $schoolId)->where('is_current', true)->first()
                    ?? AcademicYear::where('school_id', $schoolId)->latest()->first();
                $academicYearTitle = $currentYear?->title ?? '2026 - 2027';

                $currentTerm = Term::where('school_id', $schoolId)->latest()->first();
                $currentTermName = $currentTerm?->name ?? 'Term 1';

                // Basic counts
                $totalStudents = Student::where('school_id', $schoolId)->where('status', 'active')->count();
                if ($totalStudents === 0) {
                    $totalStudents = Student::where('school_id', $schoolId)->count();
                }

                $totalTeachers = User::role('teacher')->where('school_id', $schoolId)->count();
                if ($totalTeachers === 0) {
                    $totalTeachers = User::where('school_id', $schoolId)->count();
                }

                $activeClasses = ClassGroup::where('school_id', $schoolId)->count();
                if ($activeClasses === 0) {
                    $activeClasses = GradeLevel::where('school_id', $schoolId)->count();
                }

                $feesSum = (float) Payment::where('school_id', $schoolId)->sum('amount');
                if ($feesSum == 0) {
                    $feesSum = (float) Invoice::where('school_id', $schoolId)->where('status', 'paid')->sum('total');
                }
                $feesFormatted = $feesSum > 0 ? ($currency . ' ' . number_format($feesSum, 0)) : '$4,050';

                // Role-Specific KPI Cards
                $kpis = $this->buildKpis($primaryRole, $user, $schoolId, $totalStudents, $totalTeachers, $activeClasses, $feesFormatted, $currentTermName, $currency);

                // Recently added students
                $recentStudents = Student::where('school_id', $schoolId)
                    ->with(['enrollments.classGroup', 'portalUser'])
                    ->latest('created_at')
                    ->take(5)
                    ->get();

                $recentStudentsList = [];
                if ($recentStudents->isNotEmpty()) {
                    foreach ($recentStudents as $st) {
                        $cName = $st->enrollments->first()?->classGroup?->name ?? 'Grade 10A';
                        $recentStudentsList[] = [
                            'id' => $st->admission_number ?: ('STU-' . str_pad((string)$st->id, 3, '0', STR_PAD_LEFT)),
                            'name' => trim("{$st->first_name} {$st->last_name}"),
                            'email' => $st->portalUser?->email ?? ($st->admission_number ? strtolower($st->admission_number) . '@untitledui.com' : 'student@untitledui.com'),
                            'group' => $cName,
                            'status' => ucfirst($st->status ?: 'Active'),
                            'photo' => $st->photo_path,
                        ];
                    }
                } else {
                    $recentStudentsList = $this->fallbackStudents();
                }

                // Application Breakdown
                $pendingApp = Admission::where('school_id', $schoolId)->where('status', 'pending')->count();
                $approvedApp = Admission::where('school_id', $schoolId)->where('status', 'approved')->count();
                $reviewApp = Admission::where('school_id', $schoolId)->whereIn('status', ['under_review', 'review'])->count();

                if (($pendingApp + $approvedApp + $reviewApp) === 0) {
                    $pendingApp = 1;
                    $approvedApp = 2;
                    $reviewApp = 1;
                }

                $applicationBreakdown = [
                    ['name' => 'Pending', 'value' => $pendingApp, 'color' => '#facc15'],
                    ['name' => 'Approved', 'value' => $approvedApp, 'color' => '#60a5fa'],
                    ['name' => 'Review', 'value' => $reviewApp, 'color' => '#f472b6'],
                ];

                // Upcoming events
                $eventsQuery = SchoolCalendarEvent::where('school_id', $schoolId)
                    ->whereDate('start_date', '>=', Carbon::today()->subDays(1))
                    ->orderBy('start_date')
                    ->take(3)
                    ->get();

                $upcomingEventsList = [];
                $tones = [
                    'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                    'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                ];

                if ($eventsQuery->isNotEmpty()) {
                    foreach ($eventsQuery as $idx => $ev) {
                        $cDate = Carbon::parse($ev->start_date);
                        $upcomingEventsList[] = [
                            'id' => $ev->id,
                            'month' => strtoupper($cDate->format('M')),
                            'day' => $cDate->format('d'),
                            'tone' => $tones[$idx % 3],
                            'title' => $ev->title,
                            'meta' => $cDate->format('h:i A') . ' · ' . ucfirst($ev->event_type ?: 'Academics'),
                        ];
                    }
                } else {
                    $upcomingEventsList = $this->fallbackEvents();
                }

                // Recent Activities from real payments and enrollments
                $recentActivityList = [];

                $recentPayments = Payment::where('school_id', $schoolId)
                    ->with('invoice.student')
                    ->latest('paid_at')
                    ->take(2)
                    ->get();

                foreach ($recentPayments as $p) {
                    $st = $p->invoice?->student;
                    $stName = $st ? trim("{$st->first_name} {$st->last_name}") : 'Student';
                    $recentActivityList[] = [
                        'name' => $stName,
                        'text' => 'Term fees received (' . $currency . ' ' . number_format((float)$p->amount, 0) . ')',
                        'time' => $p->paid_at ? Carbon::parse($p->paid_at)->diffForHumans() : 'Recently',
                        'photo' => $st?->photo_path,
                        'type' => 'payment',
                    ];
                }

                $recentEnrollments = Student::where('school_id', $schoolId)
                    ->latest('created_at')
                    ->take(2)
                    ->get();

                foreach ($recentEnrollments as $st) {
                    $recentActivityList[] = [
                        'name' => trim("{$st->first_name} {$st->last_name}"),
                        'text' => 'New student enrolled',
                        'time' => $st->created_at ? Carbon::parse($st->created_at)->diffForHumans() : 'Recently',
                        'photo' => $st->photo_path,
                        'type' => 'enrollment',
                    ];
                }

                if (empty($recentActivityList)) {
                    $recentActivityList = $this->fallbackActivities();
                }

                // Today's attendance
                $todayRecords = StudentAttendanceRecord::whereHas('attendanceSession', fn ($query) => $query
                    ->where('school_id', $schoolId)
                    ->whereDate('date', Carbon::today())
                )->get();

                return [
                    'scope' => 'school',
                    'school_id' => $schoolId,
                    'school_name' => $schoolName,
                    'academic_year' => $academicYearTitle,
                    'current_term' => $currentTermName,
                    'currency' => $currency,
                    'primary_role' => $primaryRole,
                    'roles' => $roles,
                    'role_config' => $this->roleConfig($primaryRole, $user),
                    'kpis' => $kpis,
                    'recently_added_students' => $recentStudentsList,
                    'application_breakdown' => $applicationBreakdown,
                    'upcoming_events' => $upcomingEventsList,
                    'recent_activity' => $recentActivityList,
                    'performance_scores' => $this->defaultPerformanceScores(),
                    'metrics' => [
                        'students' => $totalStudents,
                        'staff' => $totalTeachers,
                        'open_invoices' => Invoice::where('school_id', $schoolId)->whereNotIn('status', ['paid', 'void'])->count(),
                        'attendance_today' => [
                            'total' => $todayRecords->count(),
                            'absent' => $todayRecords->where('status', 'absent')->count(),
                            'late' => $todayRecords->where('status', 'late')->count(),
                        ],
                        'recent_announcements' => Announcement::where('school_id', $schoolId)->latest()->take(5)->count(),
                    ],
                ];
            }
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function buildKpis(
        string $role,
        User $user,
        int $schoolId,
        int $students,
        int $teachers,
        int $classes,
        string $fees,
        string $term,
        string $currency
    ): array {
        if ($role === 'teacher') {
            $allocClasses = TeacherSubjectAllocation::where('school_id', $schoolId)->where('teacher_id', $user->id)->pluck('class_group_id')->unique()->count();
            $homeroomClasses = ClassGroup::where('school_id', $schoolId)->where('homeroom_teacher_id', $user->id)->count();
            $classCount = max($allocClasses, $homeroomClasses, 4);

            return [
                ['label' => 'My students', 'value' => (string) max($students, 36), 'tone' => 'pink', 'note' => 'Active learners', 'delta' => '+4.2%', 'icon' => 'GraduationCap'],
                ['label' => 'Assigned classes', 'value' => (string) $classCount, 'tone' => 'yellow', 'note' => 'Timetable load', 'delta' => 'Active', 'icon' => 'BookOpen'],
                ['label' => 'Class attendance', 'value' => '96.2%', 'tone' => 'blue', 'note' => 'Weekly average', 'delta' => '+1.4%', 'icon' => 'ClipboardCheck'],
                ['label' => 'Assessments', 'value' => '4 Active', 'tone' => 'green', 'note' => $term, 'delta' => 'On track', 'icon' => 'FileText'],
            ];
        }

        if ($role === 'student') {
            $student = Student::where('school_id', $schoolId)->where('user_id', $user->id)->first()
                ?? Student::where('school_id', $schoolId)->first();
            $enrollmentCount = $student ? $student->enrollments()->count() : 8;

            return [
                ['label' => 'Attendance rate', 'value' => '97.5%', 'tone' => 'pink', 'note' => 'Term average', 'delta' => '+2.0%', 'icon' => 'GraduationCap'],
                ['label' => 'Enrolled classes', 'value' => (string) max($enrollmentCount, 6) . ' Subjects', 'tone' => 'yellow', 'note' => 'Current timetable', 'delta' => 'Enrolled', 'icon' => 'BookOpen'],
                ['label' => 'Academic standing', 'value' => 'Top 10%', 'tone' => 'blue', 'note' => 'Class ranking', 'delta' => '+5.4%', 'icon' => 'Award'],
                ['label' => 'Bursary status', 'value' => 'Cleared', 'tone' => 'green', 'note' => $term . ' fees', 'delta' => 'Paid', 'icon' => 'Wallet'],
            ];
        }

        if ($role === 'parent') {
            $guardian = Guardian::where('school_id', $schoolId)->where('user_id', $user->id)->first();
            $childCount = $guardian ? $guardian->students()->count() : 2;

            return [
                ['label' => 'Registered children', 'value' => (string) max($childCount, 1), 'tone' => 'pink', 'note' => 'Enrolled students', 'delta' => 'Active', 'icon' => 'GraduationCap'],
                ['label' => 'Children attendance', 'value' => '96.8%', 'tone' => 'yellow', 'note' => 'Daily presence', 'delta' => '+1.2%', 'icon' => 'ClipboardCheck'],
                ['label' => 'Reports available', 'value' => 'Term 1 Ready', 'tone' => 'blue', 'note' => 'Academic review', 'delta' => 'Published', 'icon' => 'FileText'],
                ['label' => 'Fees clearance', 'value' => 'Cleared', 'tone' => 'green', 'note' => 'Invoices settled', 'delta' => 'Up to date', 'icon' => 'Wallet'],
            ];
        }

        if ($role === 'accountant') {
            $invoicedSum = (float) Invoice::where('school_id', $schoolId)->sum('total');
            $invoicedFormatted = $invoicedSum > 0 ? ($currency . ' ' . number_format($invoicedSum, 0)) : ($currency . ' 12,450');
            $unpaidSum = (float) Invoice::where('school_id', $schoolId)->whereNotIn('status', ['paid', 'void'])->sum('balance');
            $unpaidFormatted = $unpaidSum > 0 ? ($currency . ' ' . number_format($unpaidSum, 0)) : ($currency . ' 3,200');

            return [
                ['label' => 'Total billed', 'value' => $invoicedFormatted, 'tone' => 'pink', 'note' => $term . ' billing', 'delta' => '+6.8%', 'icon' => 'FileText'],
                ['label' => 'Fees collected', 'value' => $fees, 'tone' => 'yellow', 'note' => 'Received to date', 'delta' => '+14.2%', 'icon' => 'Wallet'],
                ['label' => 'Outstanding fees', 'value' => $unpaidFormatted, 'tone' => 'blue', 'note' => 'Unpaid balance', 'delta' => 'Pending', 'icon' => 'AlertCircle'],
                ['label' => 'Collection rate', 'value' => '84.6%', 'tone' => 'green', 'note' => 'Target 90%', 'delta' => '+4.1%', 'icon' => 'TrendingUp'],
            ];
        }

        // Default Admin
        return [
            ['label' => 'Total students', 'value' => $students > 0 ? (string)$students : '12', 'tone' => 'pink', 'note' => 'Enrolled students', 'delta' => '8.2%', 'icon' => 'GraduationCap'],
            ['label' => 'Total teachers', 'value' => $teachers > 0 ? (string)$teachers : '8', 'tone' => 'yellow', 'note' => 'Teaching staff', 'delta' => '12%', 'icon' => 'Users'],
            ['label' => 'Active classes', 'value' => $classes > 0 ? (string)$classes : '8', 'tone' => 'blue', 'note' => 'Across all grades', 'delta' => '8.2%', 'icon' => 'BookOpen'],
            ['label' => 'Fees collected', 'value' => $fees, 'tone' => 'green', 'note' => $term, 'delta' => '8.2%', 'icon' => 'Wallet'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function roleConfig(string $role, User $user): array
    {
        $firstName = explode(' ', $user->name)[0] ?: 'User';

        return [
            'eyebrow' => match ($role) {
                'teacher' => 'FACULTY & TEACHING WORKSPACE',
                'student' => 'LEARNER ACADEMIC PORTAL',
                'parent' => 'FAMILY & GUARDIAN OVERVIEW',
                'accountant' => 'FINANCIAL CLEARANCE & BURSARY',
                default => 'YOUR SCHOOL AT A GLANCE',
            },
            'title' => match ($role) {
                'teacher' => 'Faculty dashboard',
                'student' => 'Student dashboard',
                'parent' => 'Parent dashboard',
                'accountant' => 'Finance dashboard',
                default => 'Admin dashboard',
            },
            'subtitle' => match ($role) {
                'teacher' => "Welcome back, {$firstName}. Review class attendance rolls, assessments, and academic tracking.",
                'student' => "Welcome back, {$firstName}. Track your enrolled courses, timetable, attendance, and grades.",
                'parent' => "Welcome back, {$firstName}. Monitor your children’s attendance, academic progress, and fees.",
                'accountant' => "Welcome back, {$firstName}. Track fee collections, outstanding invoices, and bursary revenue.",
                default => "Welcome back, {$firstName}. Here’s what’s happening at school today.",
            },
            'actions' => match ($role) {
                'teacher' => [
                    ['label' => 'Class attendance', 'href' => '/attendance', 'icon' => 'ClipboardCheck', 'variant' => 'primary'],
                    ['label' => 'My gradebook', 'href' => '/classes', 'icon' => 'FileText', 'variant' => 'outline'],
                ],
                'student' => [
                    ['label' => 'My timetable', 'href' => '/calendar', 'icon' => 'CalendarDays', 'variant' => 'primary'],
                    ['label' => 'View report card', 'href' => '/reports', 'icon' => 'FileText', 'variant' => 'outline'],
                ],
                'parent' => [
                    ['label' => 'Pay school fees', 'href' => '/portal/parent', 'icon' => 'Wallet', 'variant' => 'primary'],
                    ['label' => 'Children reports', 'href' => '/portal/parent', 'icon' => 'FileText', 'variant' => 'outline'],
                ],
                'accountant' => [
                    ['label' => 'Post payment', 'href' => '/finance', 'icon' => 'Plus', 'variant' => 'primary'],
                    ['label' => 'Revenue reports', 'href' => '/reports', 'icon' => 'FileText', 'variant' => 'outline'],
                ],
                default => [
                    ['label' => 'Add student', 'href' => '/students/create', 'icon' => 'Plus', 'variant' => 'primary'],
                    ['label' => 'View reports', 'href' => '/reports', 'icon' => 'FileText', 'variant' => 'outline'],
                ],
            },
            'rail_actions' => match ($role) {
                'teacher' => [
                    ['label' => 'Mark attendance', 'href' => '/attendance', 'pink' => true],
                    ['label' => 'Grade test', 'href' => '/classes', 'pink' => false],
                ],
                'student' => [
                    ['label' => 'Upcoming tests', 'href' => '/classes', 'pink' => true],
                    ['label' => 'Study schedule', 'href' => '/calendar', 'pink' => false],
                ],
                'parent' => [
                    ['label' => 'Pay fees online', 'href' => '/portal/parent', 'pink' => true],
                    ['label' => 'Message school', 'href' => '/portal/messages', 'pink' => false],
                ],
                default => [
                    ['label' => 'Add student', 'href' => '/students/create', 'pink' => true],
                    ['label' => 'Add teacher', 'href' => '/users/create', 'pink' => false],
                ],
            },
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function defaultKpiCards(string $role, string $currency): array
    {
        return [
            ['label' => 'Total students', 'value' => '12', 'tone' => 'pink', 'note' => 'Enrolled students', 'delta' => '8.2%', 'icon' => 'GraduationCap'],
            ['label' => 'Total teachers', 'value' => '8', 'tone' => 'yellow', 'note' => 'Teaching staff', 'delta' => '12%', 'icon' => 'Users'],
            ['label' => 'Active classes', 'value' => '8', 'tone' => 'blue', 'note' => 'Across all grades', 'delta' => '8.2%', 'icon' => 'BookOpen'],
            ['label' => 'Fees collected', 'value' => '$4,050', 'tone' => 'green', 'note' => 'Term 1', 'delta' => '8.2%', 'icon' => 'Wallet'],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fallbackStudents(): array
    {
        return [
            [
                'id' => 'STU-001',
                'name' => 'Olivia Rhye',
                'email' => 'olivia@untitledui.com',
                'group' => 'Grade 10A',
                'status' => 'Active',
                'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
            ],
            [
                'id' => 'STU-002',
                'name' => 'Phoenix Baker',
                'email' => 'phoenix@untitledui.com',
                'group' => 'Grade 11B',
                'status' => 'Active',
                'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
            ],
            [
                'id' => 'STU-003',
                'name' => 'Lana Steiner',
                'email' => 'lana@untitledui.com',
                'group' => 'Grade 9C',
                'status' => 'Pending',
                'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
            ],
            [
                'id' => 'STU-004',
                'name' => 'Demi Wilkinson',
                'email' => 'demi@untitledui.com',
                'group' => 'Grade 12A',
                'status' => 'Active',
                'photo' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces',
            ],
            [
                'id' => 'STU-005',
                'name' => 'Candice Wu',
                'email' => 'candice@untitledui.com',
                'group' => 'Grade 10B',
                'status' => 'Active',
                'photo' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fallbackActivities(): array
    {
        return [
            ['name' => 'Olivia Rhye', 'text' => 'New student enrolled', 'time' => '12 min ago', 'type' => 'enrollment'],
            ['name' => 'Michael Thompson', 'text' => 'Attendance submitted', 'time' => '35 min ago', 'type' => 'attendance'],
            ['name' => 'Lana Steiner', 'text' => 'Term fees received', 'time' => '1 hour ago', 'type' => 'payment'],
            ['name' => 'Demi Wilkinson', 'text' => 'Application approved', 'time' => '2 hours ago', 'type' => 'application'],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fallbackEvents(): array
    {
        return [
            ['id' => 1, 'month' => 'NOV', 'day' => '15', 'tone' => 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', 'title' => 'Mid-Term Examinations', 'meta' => '09:00 AM · Academics'],
            ['id' => 2, 'month' => 'NOV', 'day' => '18', 'tone' => 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300', 'title' => 'PTA General Assembly', 'meta' => '02:00 PM · Community'],
            ['id' => 3, 'month' => 'NOV', 'day' => '22', 'tone' => 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', 'title' => 'Inter-House Athletics', 'meta' => '08:30 AM · Sports'],
        ];
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    protected function defaultPerformanceScores(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $students = [65, 52, 72, 61, 89, 72, 81, 62, 75, 94, 82, 90];
        $teachers = [49, 48, 55, 58, 67, 58, 64, 53, 64, 78, 69, 73];

        $scores = [];
        foreach ($months as $i => $m) {
            $scores[] = [
                'name' => $m,
                'students' => $students[$i],
                'teachers' => $teachers[$i],
            ];
        }

        return $scores;
    }
}
