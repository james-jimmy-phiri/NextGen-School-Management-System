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
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        DB::transaction(function (): void {
            $platform = User::query()->updateOrCreate(
                ['email' => 'super.admin@nextgen.africa'],
                [
                    'name' => 'Platform Super Administrator',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => null,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $platform->syncRoles(['super_admin']);

            $school = School::query()->updateOrCreate(
                ['slug' => 'horizon-international'],
                [
                    'name' => 'Horizon International School',
                    'timezone' => 'Africa/Lagos',
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
                ['address' => 'Victoria Island, Lagos', 'phone' => '+234800000001']
            );

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

            $grade = GradeLevel::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'GRADE-10'],
                ['label' => 'Grade 10', 'sort_order' => 10]
            );

            Subject::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'MATH'],
                ['name' => 'Mathematics', 'gpa_weight' => 1.2]
            );

            Subject::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'ENG'],
                ['name' => 'English Language', 'gpa_weight' => 1.0]
            );

            $admin = User::query()->updateOrCreate(
                ['email' => 'admin@horizon.demo'],
                [
                    'name' => 'Amaka School Admin',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => $school->id,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $admin->syncRoles(['school_admin']);

            $teacher = User::query()->updateOrCreate(
                ['email' => 'teacher@horizon.demo'],
                [
                    'name' => 'Chinedu Classroom Teacher',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => $school->id,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $teacher->syncRoles(['teacher']);

            $accountant = User::query()->updateOrCreate(
                ['email' => 'finance@horizon.demo'],
                [
                    'name' => 'Zainab Chief Accountant',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => $school->id,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $accountant->syncRoles(['accountant']);

            $parent = User::query()->updateOrCreate(
                ['email' => 'parent@horizon.demo'],
                [
                    'name' => 'Lola Adeyemi Parent',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => $school->id,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $parent->syncRoles(['parent']);

            $studentUser = User::query()->updateOrCreate(
                ['email' => 'student@horizon.demo'],
                [
                    'name' => 'Temi Adeyemi Student',
                    'password' => Hash::make($this->demoPassword),
                    'school_id' => $school->id,
                    'email_verified_at' => Carbon::now(),
                ]
            );
            $studentUser->syncRoles(['student']);

            $classGroup = ClassGroup::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'academic_year_id' => $academicYear->id,
                    'grade_level_id' => $grade->id,
                    'name' => 'Grade 10 Gold',
                ],
                [
                    'campus_id' => $campus->id,
                    'room' => 'Block B · 204',
                    'homeroom_teacher_id' => $teacher->id,
                ]
            );

            $studentRecord = Student::query()->updateOrCreate(
                ['school_id' => $school->id, 'admission_number' => 'HGN-260001'],
                [
                    'user_id' => $studentUser->id,
                    'first_name' => 'Temi',
                    'last_name' => 'Adeyemi',
                    'gender' => 'female',
                    'status' => 'active',
                    'date_of_birth' => Carbon::now()->subYears(15),
                    'enrollment_date' => Carbon::now()->subMonths(3),
                    'metadata' => [
                        'learner_support' => 'none',
                        'clubs' => ['robotics'],
                    ],
                ]
            );

            $guardian = Guardian::query()->updateOrCreate(
                ['school_id' => $school->id, 'user_id' => $parent->id],
                [
                    'first_name' => 'Lola',
                    'last_name' => 'Adeyemi',
                    'relationship' => 'mother',
                    'phone' => '+2348090009876',
                    'email' => 'lola.adeyemi@example.com',
                ]
            );

            $studentRecord->guardians()->sync([
                $guardian->id => [
                    'relationship' => 'mother',
                    'is_primary' => true,
                ],
            ]);

            StudentEnrollment::query()->updateOrCreate(
                [
                    'student_id' => $studentRecord->id,
                    'academic_year_id' => $academicYear->id,
                ],
                [
                    'school_id' => $school->id,
                    'class_group_id' => $classGroup->id,
                    'status' => 'enrolled',
                ]
            );

            $feeStructure = FeeStructure::query()->firstOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $academicYear->id, 'name' => 'Annual Tuition 2026'],
                [
                    'description' => 'Includes tuition & digital learning stack',
                    'components' => [
                        ['label' => 'Tuition', 'amount' => 425_000],
                        ['label' => 'ICT levy', 'amount' => 35_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            $invoice = Invoice::query()->updateOrCreate(
                ['school_id' => $school->id, 'invoice_number' => 'INV-260001'],
                [
                    'student_id' => $studentRecord->id,
                    'fee_structure_id' => $feeStructure->id,
                    'currency' => 'MWK',
                    'subtotal' => 460_000,
                    'discount' => 25_000,
                    'total' => 435_000,
                    'balance_due' => 285_000,
                    'status' => 'sent',
                    'due_date' => Carbon::now()->addMonth(),
                ]
            );

            InvoiceLine::query()->firstOrCreate(
                ['invoice_id' => $invoice->id, 'description' => 'Tuition & levies'],
                [
                    'quantity' => 1,
                    'unit_price' => 460_000,
                    'tax' => 0,
                    'total' => 460_000,
                ]
            );

            Payment::query()->firstOrCreate(
                ['reference' => 'PAY-260001'],
                [
                    'school_id' => $school->id,
                    'invoice_id' => $invoice->id,
                    'amount' => 150_000,
                    'method' => 'bank_transfer',
                    'received_by' => $accountant->id,
                    'paid_at' => Carbon::now()->subWeek(),
                    'provider_payload' => [
                        'bank' => 'GTBank',
                        'channel' => 'swift',
                    ],
                ]
            );

            Announcement::query()->firstOrCreate(
                [
                    'school_id' => $school->id,
                    'title' => 'Welcome to the NextGen academic cloud',
                ],
                [
                    'author_id' => $admin->id,
                    'body' => 'Parents can now review attendance, finance, and communication in one secure portal.',
                    'audience' => ['parents', 'teachers'],
                    'delivery_channel' => 'in_app',
                    'publish_at' => Carbon::now()->subDay(),
                ]
            );
        });
    }
}
