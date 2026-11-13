<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Assessment;
use App\Models\AssessmentMark;
use App\Models\Book;
use App\Models\BookBorrowing;
use App\Models\Campus;
use App\Models\ClassGroup;
use App\Models\ClinicVisit;
use App\Models\DisciplineRecord;
use App\Models\Family;
use App\Models\FeeStructure;
use App\Models\GradeLevel;
use App\Models\Guardian;
use App\Models\HostelAllocation;
use App\Models\HostelRoom;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\Payment;
use App\Models\PortalMessage;
use App\Models\School;
use App\Models\SchoolCalendarEvent;
use App\Models\Stream;
use App\Models\Student;
use App\Models\StudentAddress;
use App\Models\StudentAttendanceRecord;
use App\Models\StudentAttendanceSession;
use App\Models\StudentAward;
use App\Models\StudentDocument;
use App\Models\StudentEnrollment;
use App\Models\StudentTransport;
use App\Models\Subject;
use App\Models\TeacherSubjectAllocation;
use App\Models\Term;
use App\Models\TimetablePeriod;
use App\Models\TransportRoute;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StAugustineAcademySeeder extends Seeder
{
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        DB::transaction(function (): void {
            // ─────────────────────────────────────────────────────────────────
            // 1. School Profile & Campus (Mzuzu)
            // ─────────────────────────────────────────────────────────────────
            $school = School::query()->updateOrCreate(
                ['slug' => 'st-augustine-academy'],
                [
                    'name' => 'St. Augustine Academy',
                    'timezone' => 'Africa/Blantyre',
                    'locale' => 'en',
                    'settings' => [
                        'finance' => ['currency' => 'MWK', 'rounding' => 2],
                        'grading' => ['scale' => 'percentage'],
                    ],
                    'branding' => [
                        'primary' => '#1e3a8a', // Blue 900
                        'accent' => '#d97706',  // Amber 600
                    ],
                ]
            );

            $campus = Campus::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Katoto Campus'],
                [
                    'address' => 'Off M1 Road, Katoto, Mzuzu, Malawi',
                    'phone' => '+265 1 312 800',
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 2. Academic Years & 6 Terms (5 In Operation)
            // ─────────────────────────────────────────────────────────────────
            // Past Year: 2024 / 2025
            $pastYear = AcademicYear::query()->updateOrCreate(
                ['school_id' => $school->id, 'title' => '2024 / 2025'],
                [
                    'starts_on' => Carbon::create(2024, 9, 2),
                    'ends_on' => Carbon::create(2025, 7, 25),
                    'is_current' => false,
                ]
            );

            $pastTerm1 = Term::query()->updateOrCreate(
                ['academic_year_id' => $pastYear->id, 'position' => 1],
                [
                    'school_id' => $school->id,
                    'name' => 'Term I (2024)',
                    'starts_on' => Carbon::create(2024, 9, 2),
                    'ends_on' => Carbon::create(2024, 12, 13),
                ]
            );
            $pastTerm2 = Term::query()->updateOrCreate(
                ['academic_year_id' => $pastYear->id, 'position' => 2],
                [
                    'school_id' => $school->id,
                    'name' => 'Term II (2025)',
                    'starts_on' => Carbon::create(2025, 1, 6),
                    'ends_on' => Carbon::create(2025, 4, 11),
                ]
            );
            $pastTerm3 = Term::query()->updateOrCreate(
                ['academic_year_id' => $pastYear->id, 'position' => 3],
                [
                    'school_id' => $school->id,
                    'name' => 'Term III (2025)',
                    'starts_on' => Carbon::create(2025, 5, 5),
                    'ends_on' => Carbon::create(2025, 7, 25),
                ]
            );

            // Current Year: 2025 / 2026
            $currentYear = AcademicYear::query()->updateOrCreate(
                ['school_id' => $school->id, 'title' => '2025 / 2026'],
                [
                    'starts_on' => Carbon::create(2025, 9, 1),
                    'ends_on' => Carbon::create(2026, 7, 24),
                    'is_current' => true,
                ]
            );

            $currentTerm1 = Term::query()->updateOrCreate(
                ['academic_year_id' => $currentYear->id, 'position' => 1],
                [
                    'school_id' => $school->id,
                    'name' => 'Term I (2025)',
                    'starts_on' => Carbon::create(2025, 9, 1),
                    'ends_on' => Carbon::create(2025, 12, 12),
                ]
            );
            $currentTerm2 = Term::query()->updateOrCreate(
                ['academic_year_id' => $currentYear->id, 'position' => 2],
                [
                    'school_id' => $school->id,
                    'name' => 'Term II (2026)',
                    'starts_on' => Carbon::create(2026, 1, 5),
                    'ends_on' => Carbon::create(2026, 4, 10),
                ]
            );
            $currentTerm3 = Term::query()->updateOrCreate(
                ['academic_year_id' => $currentYear->id, 'position' => 3],
                [
                    'school_id' => $school->id,
                    'name' => 'Term III (2026)',
                    'starts_on' => Carbon::create(2026, 5, 4),
                    'ends_on' => Carbon::create(2026, 7, 24),
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 3. Staff Users & Specific Roles (@staugustine.demo)
            // ─────────────────────────────────────────────────────────────────
            $usersData = [
                ['email' => 'director@staugustine.demo', 'name' => 'Fr. Emmanuel Moyo', 'phone' => '+265993100001', 'role' => 'school_director'],
                ['email' => 'admin@staugustine.demo', 'name' => 'Sr. Agnes Chisi', 'phone' => '+265993100002', 'role' => 'school_admin'],
                ['email' => 'finance@staugustine.demo', 'name' => 'Joseph Mphande', 'phone' => '+265993100003', 'role' => 'accountant'],
                ['email' => 'registrar@staugustine.demo', 'name' => 'Catherine Lungu', 'phone' => '+265993100004', 'role' => 'registrar'],
                ['email' => 'teacher@staugustine.demo', 'name' => 'Br. Isaac Mhango', 'phone' => '+265993100005', 'role' => 'teacher'],
                ['email' => 'teacher2@staugustine.demo', 'name' => 'Mary Msowoya', 'phone' => '+265993100015', 'role' => 'teacher'],
                ['email' => 'teacher3@staugustine.demo', 'name' => 'Paul Chawinga', 'phone' => '+265993100016', 'role' => 'teacher'],
                ['email' => 'teacher4@staugustine.demo', 'name' => 'Monica Mkandawire', 'phone' => '+265993100017', 'role' => 'teacher'],
                ['email' => 'library@staugustine.demo', 'name' => 'Br. Peter Zgambo', 'phone' => '+265993100006', 'role' => 'librarian'],
                ['email' => 'hostel@staugustine.demo', 'name' => 'Felix Nyirenda', 'phone' => '+265993100007', 'role' => 'hostel_master'],
                ['email' => 'transport@staugustine.demo', 'name' => 'Christopher Kaira', 'phone' => '+265993100008', 'role' => 'transport_officer'],
                ['email' => 'nurse@staugustine.demo', 'name' => 'Nurse Scholastica Nkhata', 'phone' => '+265993100009', 'role' => 'nurse'],
            ];

            $staffUsers = [];
            foreach ($usersData as $u) {
                $user = User::query()->updateOrCreate(
                    ['email' => $u['email']],
                    [
                        'name' => $u['name'],
                        'password' => Hash::make($this->demoPassword),
                        'phone' => $u['phone'],
                        'school_id' => $school->id,
                        'status' => 'active',
                        'email_verified_at' => Carbon::now(),
                    ]
                );
                $user->syncRoles([$u['role']]);
                $staffUsers[$u['role']] = $user;
            }

            // ─────────────────────────────────────────────────────────────────
            // 4. Secondary Curriculum: Form 1 to Form 4 & Subjects
            // ─────────────────────────────────────────────────────────────────
            $gradeDefinitions = [
                ['code' => 'FORM-1', 'label' => 'Form 1', 'sort_order' => 1],
                ['code' => 'FORM-2', 'label' => 'Form 2', 'sort_order' => 2],
                ['code' => 'FORM-3', 'label' => 'Form 3', 'sort_order' => 3],
                ['code' => 'FORM-4', 'label' => 'Form 4', 'sort_order' => 4],
            ];
            $gradeLevels = [];
            foreach ($gradeDefinitions as $gd) {
                $gradeLevels[$gd['code']] = GradeLevel::query()->updateOrCreate(
                    ['school_id' => $school->id, 'code' => $gd['code']],
                    ['label' => $gd['label'], 'sort_order' => $gd['sort_order']]
                );
            }

            $subjectDefinitions = [
                ['code' => 'STA-MATH', 'name' => 'Mathematics', 'weight' => 1.2],
                ['code' => 'STA-ENG', 'name' => 'English Language', 'weight' => 1.0],
                ['code' => 'STA-BIO', 'name' => 'Biology', 'weight' => 1.1],
                ['code' => 'STA-CHEM', 'name' => 'Chemistry', 'weight' => 1.1],
                ['code' => 'STA-PHYS', 'name' => 'Physics', 'weight' => 1.1],
                ['code' => 'STA-AGRI', 'name' => 'Agriculture Science', 'weight' => 1.0],
                ['code' => 'STA-HIST', 'name' => 'History & Social Studies', 'weight' => 1.0],
                ['code' => 'STA-GEO', 'name' => 'Geography', 'weight' => 1.0],
                ['code' => 'STA-BK', 'name' => 'Bible Knowledge & Ethics', 'weight' => 1.0],
                ['code' => 'STA-COMP', 'name' => 'Computer Studies', 'weight' => 1.1],
            ];
            $subjects = [];
            foreach ($subjectDefinitions as $sd) {
                $subjects[$sd['code']] = Subject::query()->updateOrCreate(
                    ['school_id' => $school->id, 'code' => $sd['code']],
                    ['name' => $sd['name'], 'gpa_weight' => $sd['weight']]
                );
            }

            // Create Class Groups for both Current and Past Academic Years
            $classGroups = [];
            $classConfig = [
                'FORM-1' => ['streams' => ['St. Peter', 'St. Paul'], 'rooms' => ['St. Thomas Hall · 101', 'St. Thomas Hall · 102']],
                'FORM-2' => ['streams' => ['St. Peter', 'St. Paul'], 'rooms' => ['St. Thomas Hall · 201', 'St. Thomas Hall · 202']],
                'FORM-3' => ['streams' => ['St. Michael', 'St. Gabriel'], 'rooms' => ['St. Joseph Block · 101', 'St. Joseph Block · 102']],
                'FORM-4' => ['streams' => ['St. Michael', 'St. Gabriel'], 'rooms' => ['St. Joseph Block · 201', 'St. Joseph Block · 202']],
            ];

            $teacherPool = User::role('teacher')->where('school_id', $school->id)->get();

            foreach ($classConfig as $gCode => $config) {
                foreach ($config['streams'] as $idx => $streamName) {
                    $className = "{$gradeLevels[$gCode]->label} {$streamName}";
                    $assignedTeacher = $teacherPool[$idx % $teacherPool->count()];

                    // Current Year Class
                    $classGroups["current_{$gCode}_{$streamName}"] = ClassGroup::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $currentYear->id,
                            'grade_level_id' => $gradeLevels[$gCode]->id,
                            'name' => $className,
                        ],
                        [
                            'campus_id' => $campus->id,
                            'room' => $config['rooms'][$idx],
                            'homeroom_teacher_id' => $assignedTeacher->id,
                        ]
                    );

                    Stream::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'class_group_id' => $classGroups["current_{$gCode}_{$streamName}"]->id,
                            'name' => $streamName,
                        ]
                    );

                    // Past Year Class
                    $classGroups["past_{$gCode}_{$streamName}"] = ClassGroup::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $pastYear->id,
                            'grade_level_id' => $gradeLevels[$gCode]->id,
                            'name' => "{$className} (24/25)",
                        ],
                        [
                            'campus_id' => $campus->id,
                            'room' => $config['rooms'][$idx],
                            'homeroom_teacher_id' => $assignedTeacher->id,
                        ]
                    );
                }
            }

            // Subject Allocations
            foreach ($classGroups as $cgKey => $cg) {
                if (str_starts_with($cgKey, 'current_')) {
                    foreach ($subjects as $sCode => $subj) {
                        $t = $teacherPool[abs(crc32($sCode)) % $teacherPool->count()];
                        TeacherSubjectAllocation::query()->updateOrCreate(
                            [
                                'academic_year_id' => $currentYear->id,
                                'subject_id' => $subj->id,
                                'teacher_id' => $t->id,
                                'class_group_id' => $cg->id,
                                'stream_id' => null,
                            ],
                            ['school_id' => $school->id]
                        );
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 5. Timetable Periods
            // ─────────────────────────────────────────────────────────────────
            $sampleClass = $classGroups['current_FORM-3_St. Michael'];
            $coreSubjs = [$subjects['STA-MATH'], $subjects['STA-ENG'], $subjects['STA-BIO'], $subjects['STA-BK']];
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            foreach ($days as $dIdx => $day) {
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '07:30:00', 'end_time' => '08:15:00'],
                    ['subject_id' => $coreSubjs[$dIdx % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[0]->id, 'room' => 'St. Joseph Block · 101']
                );
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '08:20:00', 'end_time' => '09:05:00'],
                    ['subject_id' => $coreSubjs[($dIdx + 1) % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[1]->id, 'room' => 'St. Joseph Block · 101']
                );
            }

            // ─────────────────────────────────────────────────────────────────
            // 6. Fee Structures (Boarding & Day Package)
            // ─────────────────────────────────────────────────────────────────
            $pastFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $pastYear->id, 'name' => 'Boarding & Academic Package 2024/2025'],
                [
                    'description' => 'Tuition, boarding facilities, meals, and laboratory development fund',
                    'components' => [
                        ['label' => 'Tuition Fee', 'amount' => 280_000],
                        ['label' => 'Boarding & Catering', 'amount' => 120_000],
                        ['label' => 'Medical & Sports Levy', 'amount' => 20_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            $currentFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $currentYear->id, 'name' => 'Boarding & Academic Package 2025/2026'],
                [
                    'description' => 'Comprehensive secondary education, full boarding, and ICT fees',
                    'components' => [
                        ['label' => 'Tuition Fee', 'amount' => 340_000],
                        ['label' => 'Boarding & Catering', 'amount' => 150_000],
                        ['label' => 'ICT & Science Practical Levy', 'amount' => 30_000],
                        ['label' => 'Development & Library Fund', 'amount' => 20_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 7. Student Population Across All Classes (Form 1 - 4)
            // ─────────────────────────────────────────────────────────────────
            $studentsData = [
                // Form 3 St. Michael (Featured primary student)
                [
                    'adm' => 'STA-25001', 'reg' => 'REG/STA/2024/001', 'first' => 'Kondwani', 'last' => 'Moyo',
                    'gender' => 'male', 'dob' => '2010-05-11', 'grade' => 'FORM-3', 'stream' => 'St. Michael',
                    'parent_email' => 'parent@staugustine.demo', 'parent_name' => 'Felix Moyo', 'parent_phone' => '+265993100010',
                    'student_email' => 'student@staugustine.demo', 'family' => 'Moyo Family', 'district' => 'Mzimba', 'area' => 'Katoto',
                    'is_boarder' => true,
                ],
                [
                    'adm' => 'STA-25002', 'reg' => 'REG/STA/2024/002', 'first' => 'Mercy', 'last' => 'Nyirenda',
                    'gender' => 'female', 'dob' => '2010-09-22', 'grade' => 'FORM-3', 'stream' => 'St. Michael',
                    'parent_email' => 'parent2@staugustine.demo', 'parent_name' => 'Chrissy Nyirenda', 'parent_phone' => '+265993100021',
                    'student_email' => 'student2@staugustine.demo', 'family' => 'Nyirenda Family', 'district' => 'Mzimba', 'area' => 'Luwinga',
                    'is_boarder' => true,
                ],
                // Form 4 St. Gabriel
                [
                    'adm' => 'STA-25003', 'reg' => 'REG/STA/2023/044', 'first' => 'Andrew', 'last' => 'Gondwe',
                    'gender' => 'male', 'dob' => '2009-03-15', 'grade' => 'FORM-4', 'stream' => 'St. Gabriel',
                    'parent_email' => 'parent3@staugustine.demo', 'parent_name' => 'Davie Gondwe', 'parent_phone' => '+265993100022',
                    'student_email' => 'student3@staugustine.demo', 'family' => 'Gondwe Family', 'district' => 'Rumphi', 'area' => 'Katoto',
                    'is_boarder' => true,
                ],
                // Form 2 St. Peter
                [
                    'adm' => 'STA-25004', 'reg' => 'REG/STA/2024/065', 'first' => 'Tionge', 'last' => 'Mkandawire',
                    'gender' => 'female', 'dob' => '2011-10-02', 'grade' => 'FORM-2', 'stream' => 'St. Peter',
                    'parent_email' => 'parent4@staugustine.demo', 'parent_name' => 'Harrison Mkandawire', 'parent_phone' => '+265993100023',
                    'student_email' => 'student4@staugustine.demo', 'family' => 'Mkandawire Family', 'district' => 'Mzimba', 'area' => 'Chibanja',
                    'is_boarder' => false,
                ],
                // Form 1 St. Paul
                [
                    'adm' => 'STA-25005', 'reg' => 'REG/STA/2025/012', 'first' => 'Daniel', 'last' => 'Msiska',
                    'gender' => 'male', 'dob' => '2012-06-19', 'grade' => 'FORM-1', 'stream' => 'St. Paul',
                    'parent_email' => 'parent5@staugustine.demo', 'parent_name' => 'Agatha Msiska', 'parent_phone' => '+265993100024',
                    'student_email' => 'student5@staugustine.demo', 'family' => 'Msiska Family', 'district' => 'Karonga', 'area' => 'Katoto',
                    'is_boarder' => true,
                ],
            ];

            $createdStudents = [];

            foreach ($studentsData as $sIdx => $sd) {
                // Parent User & Guardian
                $parentUser = User::query()->updateOrCreate(
                    ['email' => $sd['parent_email']],
                    [
                        'name' => $sd['parent_name'],
                        'password' => Hash::make($this->demoPassword),
                        'phone' => $sd['parent_phone'],
                        'school_id' => $school->id,
                        'status' => 'active',
                        'email_verified_at' => Carbon::now(),
                    ]
                );
                $parentUser->syncRoles(['parent']);

                $guardian = Guardian::query()->updateOrCreate(
                    ['school_id' => $school->id, 'user_id' => $parentUser->id],
                    [
                        'first_name' => explode(' ', $sd['parent_name'])[0],
                        'last_name' => explode(' ', $sd['parent_name'])[1] ?? 'Guardian',
                        'relationship' => $sd['gender'] === 'female' ? 'mother' : 'father',
                        'phone' => $sd['parent_phone'],
                        'email' => $sd['parent_email'],
                        'verified_at' => Carbon::now()->subMonths(18),
                    ]
                );

                // Family
                $family = Family::query()->updateOrCreate(
                    ['school_id' => $school->id, 'name' => $sd['family']],
                    ['payer_guardian_id' => $guardian->id]
                );

                // Student User Account
                $studentUser = User::query()->updateOrCreate(
                    ['email' => $sd['student_email']],
                    [
                        'name' => "{$sd['first']} {$sd['last']}",
                        'password' => Hash::make($this->demoPassword),
                        'phone' => '+265993' . str_pad((string)(200000 + $sIdx), 6, '0', STR_PAD_LEFT),
                        'school_id' => $school->id,
                        'status' => 'active',
                        'email_verified_at' => Carbon::now(),
                    ]
                );
                $studentUser->syncRoles(['student']);

                // Student Model
                $student = Student::query()->updateOrCreate(
                    ['school_id' => $school->id, 'admission_number' => $sd['adm']],
                    [
                        'user_id' => $studentUser->id,
                        'family_id' => $family->id,
                        'responsible_guardian_id' => $guardian->id,
                        'registration_number' => $sd['reg'],
                        'first_name' => $sd['first'],
                        'last_name' => $sd['last'],
                        'gender' => $sd['gender'],
                        'date_of_birth' => Carbon::parse($sd['dob']),
                        'enrollment_date' => Carbon::create(2024, 9, 2),
                        'status' => 'active',
                        'nationality' => 'Malawian',
                        'metadata' => [
                            'is_boarder' => $sd['is_boarder'],
                            'clubs' => ['Young Christian Students (YCS)', 'Choral Choir', 'Chess Club'],
                            'house' => $sIdx % 2 === 0 ? 'St. Augustine House' : 'St. Monica House',
                        ],
                    ]
                );

                // Student Address
                StudentAddress::query()->updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'phone_number' => $sd['parent_phone'],
                        'email' => $sd['student_email'],
                        'house_number' => 'Plot ' . rand(10, 80),
                        'street_name' => 'Katoto North Avenue',
                        'area_village' => $sd['area'],
                        'district' => $sd['district'],
                        'city_town' => 'Mzuzu',
                        'country' => 'Malawi',
                    ]
                );

                // Link Guardian
                $student->guardians()->sync([
                    $guardian->id => ['relationship' => 'parent', 'is_primary' => true],
                ]);

                // Current Class & Stream
                $currentClassGroup = $classGroups["current_{$sd['grade']}_{$sd['stream']}"];
                StudentEnrollment::query()->updateOrCreate(
                    ['student_id' => $student->id, 'academic_year_id' => $currentYear->id],
                    [
                        'school_id' => $school->id,
                        'class_group_id' => $currentClassGroup->id,
                        'status' => 'enrolled',
                    ]
                );

                // Past Year Historical Enrollment (Operating in past year)
                $pastGradeMap = [
                    'FORM-4' => 'FORM-3',
                    'FORM-3' => 'FORM-2',
                    'FORM-2' => 'FORM-1',
                    'FORM-1' => 'FORM-1',
                ];
                $pastGCode = $pastGradeMap[$sd['grade']];
                $pastCg = $classGroups["past_{$pastGCode}_{$sd['stream']}"] ?? $classGroups["past_FORM-1_St. Peter"];

                StudentEnrollment::query()->updateOrCreate(
                    ['student_id' => $student->id, 'academic_year_id' => $pastYear->id],
                    [
                        'school_id' => $school->id,
                        'class_group_id' => $pastCg->id,
                        'status' => 'promoted',
                        'promoted_at' => Carbon::create(2025, 7, 28),
                    ]
                );

                $createdStudents[] = [
                    'model' => $student,
                    'user' => $studentUser,
                    'parent' => $parentUser,
                    'guardian' => $guardian,
                    'meta' => $sd,
                    'class_group' => $currentClassGroup,
                ];
            }

            // ─────────────────────────────────────────────────────────────────
            // 8. Assessments & Marks Across 5 Operating Terms
            // ─────────────────────────────────────────────────────────────────
            $operatingTerms = [
                ['term' => $pastTerm1, 'year' => $pastYear, 'name' => 'Term I 2024'],
                ['term' => $pastTerm2, 'year' => $pastYear, 'name' => 'Term II 2025'],
                ['term' => $pastTerm3, 'year' => $pastYear, 'name' => 'Term III 2025'],
                ['term' => $currentTerm1, 'year' => $currentYear, 'name' => 'Term I 2025'],
                ['term' => $currentTerm2, 'year' => $currentYear, 'name' => 'Term II 2026'],
            ];

            foreach ($operatingTerms as $tInfo) {
                $termObj = $tInfo['term'];
                $yearObj = $tInfo['year'];

                foreach (['STA-MATH', 'STA-ENG', 'STA-BIO', 'STA-BK'] as $subCode) {
                    $subj = $subjects[$subCode];
                    $sampleCg = $classGroups['current_FORM-3_St. Michael'];

                    $midAssessment = Assessment::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $yearObj->id,
                            'term_id' => $termObj->id,
                            'subject_id' => $subj->id,
                            'class_group_id' => $sampleCg->id,
                            'title' => "{$tInfo['name']} Mid-Term Continuous Assessment - {$subj->name}",
                        ],
                        [
                            'type' => 'Test',
                            'max_score' => 100,
                            'weight' => 30,
                            'due_at' => $termObj->starts_on->copy()->addWeeks(6),
                        ]
                    );

                    $endAssessment = Assessment::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $yearObj->id,
                            'term_id' => $termObj->id,
                            'subject_id' => $subj->id,
                            'class_group_id' => $sampleCg->id,
                            'title' => "{$tInfo['name']} Terminal Examination - {$subj->name}",
                        ],
                        [
                            'type' => 'Exam',
                            'max_score' => 100,
                            'weight' => 70,
                            'due_at' => $termObj->ends_on->copy()->subDays(5),
                        ]
                    );

                    // Add marks for Form 3 St. Michael students
                    foreach ([$createdStudents[0], $createdStudents[1]] as $stEntry) {
                        $scoreMid = rand(76, 94);
                        $scoreEnd = rand(75, 95);

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $midAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreMid,
                                'grade' => $scoreMid >= 85 ? 'A' : ($scoreMid >= 75 ? 'B+' : 'B'),
                                'comment' => 'Dedicated approach and consistent accuracy in coursework.',
                            ]
                        );

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $endAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreEnd,
                                'grade' => $scoreEnd >= 85 ? 'A' : ($scoreEnd >= 75 ? 'B+' : 'B'),
                                'comment' => 'High mastery demonstrated across all examined areas.',
                            ]
                        );
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 9. Attendance Sessions & Records (Past Weeks to Current Day)
            // ─────────────────────────────────────────────────────────────────
            $sampleClass = $classGroups['current_FORM-3_St. Michael'];
            $teacherMhango = $staffUsers['teacher'];

            for ($daysBack = 14; $daysBack >= 0; $daysBack--) {
                $checkDate = Carbon::now()->subDays($daysBack);
                if ($checkDate->isWeekend()) {
                    continue;
                }

                $session = StudentAttendanceSession::query()->updateOrCreate(
                    [
                        'class_group_id' => $sampleClass->id,
                        'date' => $checkDate->toDateString(),
                    ],
                    [
                        'school_id' => $school->id,
                        'academic_year_id' => $currentYear->id,
                        'marked_by' => $teacherMhango->id,
                        'method' => 'manual',
                        'source' => 'morning_rollcall',
                    ]
                );

                foreach ([$createdStudents[0], $createdStudents[1]] as $stEntry) {
                    StudentAttendanceRecord::query()->updateOrCreate(
                        ['session_id' => $session->id, 'student_id' => $stEntry['model']->id],
                        [
                            'status' => 'present',
                            'arrived_at' => $checkDate->copy()->setTime(7, 20 + rand(0, 8)),
                            'notes' => 'Present for morning devotion and class',
                        ]
                    );
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 10. Financial Operations: Invoices Across 5 Terms & Bank/Mpamba Payments
            // ─────────────────────────────────────────────────────────────────
            $accountantUser = $staffUsers['accountant'];
            $mainStudent = $createdStudents[0]['model'];

            $termsInvoiceData = [
                ['term' => 'Term I 2024', 'fee' => $pastFee, 'num' => 'INV-STA-2401', 'total' => 420_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2024, 9, 10)],
                ['term' => 'Term II 2025', 'fee' => $pastFee, 'num' => 'INV-STA-2501', 'total' => 420_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 1, 10)],
                ['term' => 'Term III 2025', 'fee' => $pastFee, 'num' => 'INV-STA-2502', 'total' => 420_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 5, 10)],
                ['term' => 'Term I 2025', 'fee' => $currentFee, 'num' => 'INV-STA-2503', 'total' => 540_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 9, 8)],
                ['term' => 'Term II 2026', 'fee' => $currentFee, 'num' => 'INV-STA-2601', 'total' => 540_000, 'balance' => 140_000, 'status' => 'partial', 'date' => Carbon::create(2026, 1, 12)],
            ];

            foreach ($termsInvoiceData as $invD) {
                $invoice = Invoice::query()->updateOrCreate(
                    ['school_id' => $school->id, 'invoice_number' => $invD['num']],
                    [
                        'student_id' => $mainStudent->id,
                        'fee_structure_id' => $invD['fee']->id,
                        'currency' => 'MWK',
                        'subtotal' => $invD['total'],
                        'discount' => 0,
                        'total' => $invD['total'],
                        'balance_due' => $invD['balance'],
                        'status' => $invD['status'],
                        'due_date' => $invD['date']->copy()->addMonth(),
                    ]
                );

                InvoiceLine::query()->firstOrCreate(
                    ['invoice_id' => $invoice->id, 'description' => "Tuition & Boarding Services for {$invD['term']}"],
                    ['quantity' => 1, 'unit_price' => $invD['total'], 'tax' => 0, 'total' => $invD['total']]
                );

                $paidAmount = $invD['total'] - $invD['balance'];
                if ($paidAmount > 0) {
                    $ref = 'PAY-' . str_replace('INV-', '', $invD['num']);
                    Payment::query()->firstOrCreate(
                        ['reference' => $ref],
                        [
                            'school_id' => $school->id,
                            'invoice_id' => $invoice->id,
                            'amount' => $paidAmount,
                            'method' => 'bank_transfer',
                            'received_by' => $accountantUser->id,
                            'paid_at' => $invD['date']->copy()->addDays(5),
                            'provider_payload' => [
                                'bank' => 'Standard Bank Malawi',
                                'account' => '91000384910',
                                'branch' => 'Mzuzu Branch',
                                'ref' => 'SBM-' . rand(100000, 999999),
                            ],
                        ]
                    );
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 11. Communication: Announcements, Calendar & Messages
            // ─────────────────────────────────────────────────────────────────
            $adminUser = $staffUsers['school_admin'];

            $announcements = [
                [
                    'title' => 'St. Augustine Feast Day & Community Thanksgiving',
                    'body' => 'All parents, guardians, and alumni are cordially invited to the annual Feast Day Eucharistic celebration and cultural festival on Friday, 17th April 2026.',
                    'audience' => ['parents', 'students', 'teachers'],
                    'date' => Carbon::now()->subDays(4),
                ],
                [
                    'title' => 'Northern Education Division Science Exhibition Winners',
                    'body' => 'St. Augustine Academy secured first position in agricultural biology and water purification at the Northern Region STEM symposium held in Mzuzu.',
                    'audience' => ['parents', 'students', 'teachers'],
                    'date' => Carbon::now()->subWeeks(2),
                ],
            ];
            foreach ($announcements as $ann) {
                Announcement::query()->updateOrCreate(
                    ['school_id' => $school->id, 'title' => $ann['title']],
                    [
                        'author_id' => $adminUser->id,
                        'body' => $ann['body'],
                        'audience' => $ann['audience'],
                        'delivery_channel' => 'in_app',
                        'publish_at' => $ann['date'],
                    ]
                );
            }

            // Calendar
            $calendarEvents = [
                ['title' => 'Term II Mid-Term Retreat', 'type' => 'spiritual', 'start' => Carbon::now()->addDays(12)->toDateString(), 'end' => Carbon::now()->addDays(15)->toDateString(), 'is_holiday' => false],
                ['title' => 'Inter-School Sports Gala (Katoto Stadium)', 'type' => 'sports', 'start' => Carbon::now()->addDays(24)->toDateString(), 'end' => null, 'is_holiday' => false],
            ];
            foreach ($calendarEvents as $ce) {
                SchoolCalendarEvent::query()->updateOrCreate(
                    ['school_id' => $school->id, 'title' => $ce['title']],
                    [
                        'description' => "Calendar item: {$ce['title']}",
                        'event_type' => $ce['type'],
                        'start_date' => $ce['start'],
                        'end_date' => $ce['end'],
                        'is_holiday' => $ce['is_holiday'],
                    ]
                );
            }

            // Direct Portal Message
            PortalMessage::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'from_user_id' => $createdStudents[0]['parent']->id,
                    'to_user_id' => $staffUsers['teacher']->id,
                    'subject' => 'Inquiry regarding Chemistry Practical Materials',
                ],
                [
                    'student_id' => $mainStudent->id,
                    'body' => 'Greetings Brother Isaac. Kondwani mentioned the class is preparing for titration experiments next week. We wanted to confirm if safety lab coats are supplied by the school.',
                    'read_at' => Carbon::now()->subDays(2),
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 12. Student Welfare, Clinic, Awards & Documents
            // ─────────────────────────────────────────────────────────────────
            ClinicVisit::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'date' => Carbon::now()->subWeeks(3)->toDateString()],
                [
                    'condition' => 'Seasonal Allergy & Mild Cold',
                    'action' => 'Administered Cetirizine 10mg and Vitamin C, recommended warm hydration.',
                    'notes' => 'Fully cleared and returned to hostel.',
                ]
            );

            StudentAward::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'title' => 'Best Student in Agricultural Sciences'],
                [
                    'category' => 'Vocational Distinction',
                    'date' => Carbon::create(2025, 7, 20)->toDateString(),
                    'description' => 'Managed exemplary greenhouse maize and legume trials on the school demonstration farm.',
                ]
            );

            StudentDocument::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'document_type' => 'Baptismal and Admission Record'],
                ['file_path' => '/storage/documents/STA_BAPTISM_MOYO.pdf', 'file_name' => 'St_Augustine_Admission_Profile.pdf']
            );

            // ─────────────────────────────────────────────────────────────────
            // 13. Hostel Facilities & Boarding Allocations
            // ─────────────────────────────────────────────────────────────────
            $hostelStJude = HostelRoom::query()->updateOrCreate(
                ['school_id' => $school->id, 'room_number' => 'J-102'],
                [
                    'block' => 'St. Jude Dormitory (Boys)',
                    'gender' => 'male',
                    'capacity' => 4,
                    'floor' => 1,
                    'facilities' => 'Bunk beds, steel storage lockers, study reading tables',
                ]
            );

            HostelAllocation::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'student_id' => $mainStudent->id,
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    'hostel_room_id' => $hostelStJude->id,
                    'starts_on' => $currentYear->starts_on->toDateString(),
                    'ends_on' => $currentYear->ends_on->toDateString(),
                    'is_current' => true,
                    'allocated_by' => $staffUsers['hostel_master']->id,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 14. Transport Fleet & Route
            // ─────────────────────────────────────────────────────────────────
            $vehicle = Vehicle::query()->updateOrCreate(
                ['registration' => 'MZ 1092'],
                [
                    'school_id' => $school->id,
                    'make' => 'Isuzu',
                    'model' => 'Journey 28-Seater',
                    'year' => 2021,
                    'capacity' => 28,
                    'driver_name' => 'Jonas Chavula',
                    'driver_phone' => '+265888300400',
                    'status' => 'active',
                ]
            );

            $route = TransportRoute::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Route North: Luwinga · Chibanja · Katoto'],
                [
                    'vehicle_id' => $vehicle->id,
                    'direction' => 'both',
                    'pickup_points' => [
                        ['name' => 'Mzuzu University Luwinga Gate', 'time' => '06:40 AM'],
                        ['name' => 'Chibanja Total Energies Service Station', 'time' => '07:00 AM'],
                        ['name' => 'Katoto St. Augustine Academy Campus', 'time' => '07:20 AM'],
                    ],
                ]
            );

            StudentTransport::query()->updateOrCreate(
                [
                    'student_id' => $createdStudents[3]['model']->id, // Tionge Mkandawire (Day Scholar)
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    'school_id' => $school->id,
                    'transport_route_id' => $route->id,
                    'pickup_point' => 'Chibanja Total Energies Service Station',
                    'is_active' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 15. Library Books & Borrowings
            // ─────────────────────────────────────────────────────────────────
            $booksData = [
                ['title' => 'Certificate Agriculture for Southern Africa', 'author' => 'O. C. Onazi', 'isbn' => '9780195726206', 'cat' => 'Agriculture', 'copies' => 20, 'shelf' => 'Shelf A-01'],
                ['title' => 'A New General Mathematics for Malawi Book 3', 'author' => 'Channon & Smith', 'isbn' => '9780582655386', 'cat' => 'Mathematics', 'copies' => 30, 'shelf' => 'Shelf M-05'],
                ['title' => 'Concise Biology for MSCE', 'author' => 'D. G. Mackean', 'isbn' => '9780719541575', 'cat' => 'Biological Sciences', 'copies' => 25, 'shelf' => 'Shelf B-02'],
            ];

            foreach ($booksData as $bd) {
                $book = Book::query()->updateOrCreate(
                    ['school_id' => $school->id, 'title' => $bd['title']],
                    [
                        'author' => $bd['author'],
                        'isbn' => $bd['isbn'],
                        'category' => $bd['cat'],
                        'total_copies' => $bd['copies'],
                        'available_copies' => $bd['copies'] - 1,
                        'shelf_location' => $bd['shelf'],
                    ]
                );

                if ($bd['cat'] === 'Agriculture') {
                    BookBorrowing::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'book_id' => $book->id,
                            'borrower_type' => Student::class,
                            'borrower_id' => $mainStudent->id,
                        ],
                        [
                            'issued_by' => $staffUsers['librarian']->id,
                            'issued_on' => Carbon::now()->subDays(6)->toDateString(),
                            'due_on' => Carbon::now()->addDays(8)->toDateString(),
                            'returned_on' => null,
                            'fine_amount' => 0,
                            'status' => 'active',
                        ]
                    );
                }
            }
        });

        $this->command?->info('✅ St. Augustine Academy seeded with 5 operating terms & full operations.');
    }
}

