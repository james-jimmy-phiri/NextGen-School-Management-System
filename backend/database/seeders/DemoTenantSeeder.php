<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Campus;
use App\Models\ClassGroup;
use App\Models\FeeStructure;
use App\Models\GradeLevel;
use App\Models\Guardian;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\Payment;
use App\Models\School;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\Subject;
use App\Models\Term;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoTenantSeeder extends Seeder
{
    /**
     * Shared demo password for all seeded accounts.
     * Display this on the login page in development.
     */
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        DB::transaction(function (): void {

            // ─── 1. Platform Super Admin ──────────────────────────────────────
            $platform = User::query()->updateOrCreate(
                ['email' => 'super.admin@nextgen.mw'],
                [
                    'name' => 'Platform Super Administrator',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991000001',
                    'school_id' => null,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $platform->syncRoles(['super_admin']);

            // ─── 2. Demo School — Sunrise Academy, Lilongwe ───────────────────
            $school = School::query()->updateOrCreate(
                ['slug' => 'sunrise-academy'],
                [
                    'name' => 'Sunrise Academy',
                    'timezone' => 'Africa/Blantyre',
                    'locale' => 'en',
                    'settings' => [
                        'finance' => ['currency' => 'MWK', 'rounding' => 2],
                        'grading' => ['scale' => 'percentage'],
                    ],
                    'branding' => [
                        'primary' => '#0f172a',
                        'accent' => '#6366f1',
                    ],
                ]
            );

            $campus = Campus::query()->firstOrCreate(
                ['school_id' => $school->id, 'name' => 'Main Campus'],
                ['address' => 'Area 47, Lilongwe, Malawi', 'phone' => '+265111234567']
            );

            // ─── 3. Academic Year & Term ──────────────────────────────────────
            AcademicYear::query()->where('school_id', $school->id)->update(['is_current' => false]);

            $academicYear = AcademicYear::query()->updateOrCreate(
                ['school_id' => $school->id, 'title' => '2026 / 2027'],
                [
                    'starts_on' => Carbon::now()->startOfYear(),
                    'ends_on' => Carbon::now()->endOfYear(),
                    'is_current' => true,
                ]
            );

            Term::query()->firstOrCreate(
                ['academic_year_id' => $academicYear->id, 'position' => 1],
                [
                    'school_id' => $school->id,
                    'name' => 'Term I',
                    'starts_on' => Carbon::now()->startOfYear(),
                    'ends_on' => Carbon::now()->startOfYear()->copy()->addMonths(4),
                ]
            );

            // ─── 4. Grade & Subjects ──────────────────────────────────────────
            $grade = GradeLevel::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'FORM-3'],
                ['label' => 'Form 3', 'sort_order' => 3]
            );

            Subject::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'MATH'],
                ['name' => 'Mathematics', 'gpa_weight' => 1.2]
            );
            Subject::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'ENG'],
                ['name' => 'English Language', 'gpa_weight' => 1.0]
            );
            Subject::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'SCI'],
                ['name' => 'Integrated Science', 'gpa_weight' => 1.1]
            );

            // ─── 5. Staff Users ───────────────────────────────────────────────

            // School Director
            $director = User::query()->updateOrCreate(
                ['email' => 'director@sunrise.demo'],
                [
                    'name' => 'Chisomo Banda',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100001',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $director->syncRoles(['school_director']);

            // School Admin
            $admin = User::query()->updateOrCreate(
                ['email' => 'admin@sunrise.demo'],
                [
                    'name' => 'Thandiwe Phiri',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100002',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $admin->syncRoles(['school_admin']);

            // Accountant / Bursar
            $accountant = User::query()->updateOrCreate(
                ['email' => 'finance@sunrise.demo'],
                [
                    'name' => 'Kondwani Mwale',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100003',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $accountant->syncRoles(['accountant']);

            // Registrar
            $registrar = User::query()->updateOrCreate(
                ['email' => 'registrar@sunrise.demo'],
                [
                    'name' => 'Alinafe Chirwa',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100004',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $registrar->syncRoles(['registrar']);

            // Teacher
            $teacher = User::query()->updateOrCreate(
                ['email' => 'teacher@sunrise.demo'],
                [
                    'name' => 'Dalitso Nkosi',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100005',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $teacher->syncRoles(['teacher']);

            // Librarian
            $librarian = User::query()->updateOrCreate(
                ['email' => 'library@sunrise.demo'],
                [
                    'name' => 'Lusungu Tembo',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100006',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $librarian->syncRoles(['librarian']);

            // Hostel Master
            $hostelMaster = User::query()->updateOrCreate(
                ['email' => 'hostel@sunrise.demo'],
                [
                    'name' => 'Mphatso Gondwe',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100007',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $hostelMaster->syncRoles(['hostel_master']);

            // Transport Officer
            $transport = User::query()->updateOrCreate(
                ['email' => 'transport@sunrise.demo'],
                [
                    'name' => 'Yankho Kumwenda',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100008',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $transport->syncRoles(['transport_officer']);

            // Nurse
            $nurse = User::query()->updateOrCreate(
                ['email' => 'nurse@sunrise.demo'],
                [
                    'name' => 'Tionge Mvula',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100009',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $nurse->syncRoles(['nurse']);

            // Parent
            $parent = User::query()->updateOrCreate(
                ['email' => 'parent@sunrise.demo'],
                [
                    'name' => 'Blessings Kamanga',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100010',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $parent->syncRoles(['parent']);

            // Student User Account
            $studentUser = User::query()->updateOrCreate(
                ['email' => 'student@sunrise.demo'],
                [
                    'name' => 'Chimwemwe Kamanga',
                    'password' => Hash::make($this->demoPassword),
                    'phone' => '+265991100011',
                    'school_id' => $school->id,
                    'status' => 'active',
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $studentUser->syncRoles(['student']);

            // ─── 6. Class & Student Record ────────────────────────────────────
            $classGroup = ClassGroup::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'academic_year_id' => $academicYear->id,
                    'grade_level_id' => $grade->id,
                    'name' => 'Form 3 Sapphire',
                ],
                [
                    'campus_id' => $campus->id,
                    'room' => 'Block A · 101',
                    'homeroom_teacher_id' => $teacher->id,
                ]
            );

            $studentRecord = Student::query()->updateOrCreate(
                ['school_id' => $school->id, 'admission_number' => 'SA-260001'],
                [
                    'user_id' => $studentUser->id,
                    'first_name' => 'Chimwemwe',
                    'last_name' => 'Kamanga',
                    'gender' => 'female',
                    'status' => 'active',
                    'date_of_birth' => Carbon::now()->subYears(15),
                    'enrollment_date' => Carbon::now()->subMonths(3),
                    'metadata' => ['learner_support' => 'none', 'clubs' => ['debate', 'science']],
                ]
            );

            $guardian = Guardian::query()->updateOrCreate(
                ['school_id' => $school->id, 'user_id' => $parent->id],
                [
                    'first_name' => 'Blessings',
                    'last_name' => 'Kamanga',
                    'relationship' => 'mother',
                    'phone' => '+265991100010',
                    'email' => 'blessings.kamanga@example.com',
                ]
            );

            $studentRecord->guardians()->sync([
                $guardian->id => ['relationship' => 'mother', 'is_primary' => true],
            ]);

            StudentEnrollment::query()->updateOrCreate(
                ['student_id' => $studentRecord->id, 'academic_year_id' => $academicYear->id],
                [
                    'school_id' => $school->id,
                    'class_group_id' => $classGroup->id,
                    'status' => 'enrolled',
                ]
            );

            // ─── 7. Finance ───────────────────────────────────────────────────
            $feeStructure = FeeStructure::query()->firstOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $academicYear->id, 'name' => 'Annual Tuition 2026'],
                [
                    'description' => 'Includes tuition & digital learning stack',
                    'components' => [
                        ['label' => 'Tuition', 'amount' => 350_000],
                        ['label' => 'ICT Levy', 'amount' => 25_000],
                        ['label' => 'Development Fee', 'amount' => 15_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            $invoice = Invoice::query()->updateOrCreate(
                ['school_id' => $school->id, 'invoice_number' => 'INV-SA-260001'],
                [
                    'student_id' => $studentRecord->id,
                    'fee_structure_id' => $feeStructure->id,
                    'currency' => 'MWK',
                    'subtotal' => 390_000,
                    'discount' => 15_000,
                    'total' => 375_000,
                    'balance_due' => 225_000,
                    'status' => 'sent',
                    'due_date' => Carbon::now()->addMonth(),
                ]
            );

            InvoiceLine::query()->firstOrCreate(
                ['invoice_id' => $invoice->id, 'description' => 'Tuition & Levies 2026'],
                ['quantity' => 1, 'unit_price' => 390_000, 'tax' => 0, 'total' => 390_000]
            );

            Payment::query()->firstOrCreate(
                ['reference' => 'PAY-SA-260001'],
                [
                    'school_id' => $school->id,
                    'invoice_id' => $invoice->id,
                    'amount' => 150_000,
                    'method' => 'mobile_money',
                    'received_by' => $accountant->id,
                    'paid_at' => Carbon::now()->subWeek(),
                    'provider_payload' => ['provider' => 'Airtel Money', 'reference' => 'AM-887766'],
                ]
            );

            // ─── 8. Announcement ─────────────────────────────────────────────
            Announcement::query()->firstOrCreate(
                ['school_id' => $school->id, 'title' => 'Welcome to Sunrise Academy NextGen Portal'],
                [
                    'author_id' => $admin->id,
                    'body' => 'Dear parents and students, welcome to our new digital school management system. You can now view attendance, fees, and communicate with teachers — all in one place.',
                    'audience' => ['parents', 'students', 'teachers'],
                    'delivery_channel' => 'in_app',
                    'publish_at' => Carbon::now()->subDay(),
                ]
            );

            // ─── 9. Academics, Timetable, Clinic, Awards & Documents (Portal Data) ────────

            // Assessments & Marks
            $assessment1 = \App\Models\Assessment::query()->firstOrCreate(
                ['school_id' => $school->id, 'title' => 'Mid Term Test', 'subject_id' => \App\Models\Subject::where('code', 'MATH')->first()->id],
                ['academic_year_id' => $academicYear->id, 'class_group_id' => $classGroup->id, 'term_id' => Term::first()->id, 'type' => 'Test', 'max_score' => 100, 'weight' => 20, 'due_at' => Carbon::now()->subDays(15)]
            );
            $assessment2 = \App\Models\Assessment::query()->firstOrCreate(
                ['school_id' => $school->id, 'title' => 'Science Project', 'subject_id' => \App\Models\Subject::where('code', 'SCI')->first()->id],
                ['academic_year_id' => $academicYear->id, 'class_group_id' => $classGroup->id, 'term_id' => Term::first()->id, 'type' => 'Project', 'max_score' => 100, 'weight' => 30, 'due_at' => Carbon::now()->subDays(10)]
            );

            \App\Models\AssessmentMark::query()->firstOrCreate(
                ['school_id' => $school->id, 'assessment_id' => $assessment1->id, 'student_id' => $studentRecord->id],
                ['score' => 88, 'grade' => 'A', 'comment' => 'Great work in algebra!']
            );
            \App\Models\AssessmentMark::query()->firstOrCreate(
                ['school_id' => $school->id, 'assessment_id' => $assessment2->id, 'student_id' => $studentRecord->id],
                ['score' => 92, 'grade' => 'A', 'comment' => 'Excellent project execution.']
            );

            // Timetable Periods
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            $mathSubject = \App\Models\Subject::where('code', 'MATH')->first();
            $engSubject = \App\Models\Subject::where('code', 'ENG')->first();
            $sciSubject = \App\Models\Subject::where('code', 'SCI')->first();
            
            foreach ($days as $day) {
                // Period 1
                \App\Models\TimetablePeriod::query()->firstOrCreate(
                    ['class_group_id' => $classGroup->id, 'day_of_week' => $day, 'start_time' => '08:00:00', 'end_time' => '08:40:00'],
                    ['subject_id' => $mathSubject->id, 'teacher_id' => $teacher->id, 'room' => 'Room 101']
                );
                // Period 2
                \App\Models\TimetablePeriod::query()->firstOrCreate(
                    ['class_group_id' => $classGroup->id, 'day_of_week' => $day, 'start_time' => '08:40:00', 'end_time' => '09:20:00'],
                    ['subject_id' => collect([$engSubject, $sciSubject])->random()->id, 'teacher_id' => $teacher->id, 'room' => 'Room 101']
                );
                // Break
                \App\Models\TimetablePeriod::query()->firstOrCreate(
                    ['class_group_id' => $classGroup->id, 'day_of_week' => $day, 'start_time' => '10:00:00', 'end_time' => '10:30:00'],
                    ['is_break' => true, 'name' => 'Morning Break']
                );
            }

            // Clinic Visits
            \App\Models\ClinicVisit::query()->firstOrCreate(
                ['student_id' => $studentRecord->id, 'date' => Carbon::now()->subDays(5)->format('Y-m-d')],
                ['condition' => 'Headache', 'action' => 'Given Paracetamol, rested for 1 hour', 'notes' => 'Returned to class after rest']
            );

            // Awards
            \App\Models\StudentAward::query()->firstOrCreate(
                ['student_id' => $studentRecord->id, 'title' => 'Student of the Month', 'date' => Carbon::now()->subMonths(1)->format('Y-m-d')],
                ['category' => 'Academic Excellence', 'description' => 'Awarded for outstanding performance in mathematics.']
            );

            // Documents
            \App\Models\StudentDocument::query()->firstOrCreate(
                ['student_id' => $studentRecord->id, 'document_type' => 'Admission Letter'],
                ['file_path' => '#', 'file_name' => 'Admission_Letter_2026.pdf']
            );
            \App\Models\StudentDocument::query()->firstOrCreate(
                ['student_id' => $studentRecord->id, 'document_type' => 'Medical Clearance'],
                ['file_path' => '#', 'file_name' => 'Medical_Clearance.pdf']
            );

            // Discipline
            \App\Models\DisciplineRecord::query()->firstOrCreate(
                ['school_id' => $school->id, 'student_id' => $studentRecord->id, 'reported_by' => $teacher->id, 'date' => Carbon::now()->subDays(20)->format('Y-m-d')],
                ['incident_type' => 'Late Coming', 'description' => 'Arrived 15 minutes late for first period.', 'action_taken' => 'Verbal Warning', 'severity' => 'low', 'points_deducted' => 1, 'status' => 'recorded']
            );

        });

        $this->command->info('✅ Demo tenant seeded: Sunrise Academy, Lilongwe, Malawi');
        $this->command->newLine();
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Super Admin',       'super.admin@nextgen.mw',   $this->demoPassword],
                ['School Director',   'director@sunrise.demo',    $this->demoPassword],
                ['School Admin',      'admin@sunrise.demo',       $this->demoPassword],
                ['Accountant',        'finance@sunrise.demo',     $this->demoPassword],
                ['Registrar',         'registrar@sunrise.demo',   $this->demoPassword],
                ['Teacher',           'teacher@sunrise.demo',     $this->demoPassword],
                ['Librarian',         'library@sunrise.demo',     $this->demoPassword],
                ['Hostel Master',     'hostel@sunrise.demo',      $this->demoPassword],
                ['Transport Officer', 'transport@sunrise.demo',   $this->demoPassword],
                ['Nurse',             'nurse@sunrise.demo',       $this->demoPassword],
                ['Parent',            'parent@sunrise.demo',      $this->demoPassword],
                ['Student',           'student@sunrise.demo',     $this->demoPassword],
            ]
        );
    }
}
