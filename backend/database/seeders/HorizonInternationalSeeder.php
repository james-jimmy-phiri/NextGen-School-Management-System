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

class HorizonInternationalSeeder extends Seeder
{
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        DB::transaction(function (): void {
            // ─────────────────────────────────────────────────────────────────
            // 1. School Profile & Campus (Blantyre)
            // ─────────────────────────────────────────────────────────────────
            $school = School::query()->updateOrCreate(
                ['slug' => 'horizon-international'],
                [
                    'name' => 'Horizon International School',
                    'timezone' => 'Africa/Blantyre',
                    'locale' => 'en',
                    'settings' => [
                        'finance' => ['currency' => 'MWK', 'rounding' => 2],
                        'grading' => ['scale' => 'percentage'],
                    ],
                    'branding' => [
                        'primary' => '#064e3b', // Emerald 900
                        'accent' => '#059669',  // Emerald 600
                    ],
                ]
            );

            $campus = Campus::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Nyambadwe Heights Campus'],
                [
                    'address' => 'Plot 12, Nyambadwe Ridge Road, Blantyre, Malawi',
                    'phone' => '+265 1 834 500',
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
                    'name' => 'Autumn Term (2024)',
                    'starts_on' => Carbon::create(2024, 9, 2),
                    'ends_on' => Carbon::create(2024, 12, 13),
                ]
            );
            $pastTerm2 = Term::query()->updateOrCreate(
                ['academic_year_id' => $pastYear->id, 'position' => 2],
                [
                    'school_id' => $school->id,
                    'name' => 'Spring Term (2025)',
                    'starts_on' => Carbon::create(2025, 1, 6),
                    'ends_on' => Carbon::create(2025, 4, 11),
                ]
            );
            $pastTerm3 = Term::query()->updateOrCreate(
                ['academic_year_id' => $pastYear->id, 'position' => 3],
                [
                    'school_id' => $school->id,
                    'name' => 'Summer Term (2025)',
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
                    'name' => 'Autumn Term (2025)',
                    'starts_on' => Carbon::create(2025, 9, 1),
                    'ends_on' => Carbon::create(2025, 12, 12),
                ]
            );
            $currentTerm2 = Term::query()->updateOrCreate(
                ['academic_year_id' => $currentYear->id, 'position' => 2],
                [
                    'school_id' => $school->id,
                    'name' => 'Spring Term (2026)',
                    'starts_on' => Carbon::create(2026, 1, 5),
                    'ends_on' => Carbon::create(2026, 4, 10),
                ]
            );
            $currentTerm3 = Term::query()->updateOrCreate(
                ['academic_year_id' => $currentYear->id, 'position' => 3],
                [
                    'school_id' => $school->id,
                    'name' => 'Summer Term (2026)',
                    'starts_on' => Carbon::create(2026, 5, 4),
                    'ends_on' => Carbon::create(2026, 7, 24),
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 3. Staff Users & Specific System Roles (@horizon.demo)
            // ─────────────────────────────────────────────────────────────────
            $usersData = [
                ['email' => 'director@horizon.demo', 'name' => 'Dr. Alistair Sterling', 'phone' => '+265992100001', 'role' => 'school_director'],
                ['email' => 'admin@horizon.demo', 'name' => 'Natasha Kazembe', 'phone' => '+265992100002', 'role' => 'school_admin'],
                ['email' => 'finance@horizon.demo', 'name' => 'Chimango Nyasulu', 'phone' => '+265992100003', 'role' => 'accountant'],
                ['email' => 'registrar@horizon.demo', 'name' => 'Victoria Mlenga', 'phone' => '+265992100004', 'role' => 'registrar'],
                ['email' => 'teacher@horizon.demo', 'name' => 'Tiyamike Gondwe', 'phone' => '+265992100005', 'role' => 'teacher'],
                ['email' => 'teacher2@horizon.demo', 'name' => 'Samantha Mwase', 'phone' => '+265992100015', 'role' => 'teacher'],
                ['email' => 'teacher3@horizon.demo', 'name' => 'Geoffrey Kachale', 'phone' => '+265992100016', 'role' => 'teacher'],
                ['email' => 'teacher4@horizon.demo', 'name' => 'Fatima Patel', 'phone' => '+265992100017', 'role' => 'teacher'],
                ['email' => 'library@horizon.demo', 'name' => 'Isaac Kamwendo', 'phone' => '+265992100006', 'role' => 'librarian'],
                ['email' => 'hostel@horizon.demo', 'name' => 'Arthur Chinkhadze', 'phone' => '+265992100007', 'role' => 'hostel_master'],
                ['email' => 'transport@horizon.demo', 'name' => 'Dyson Matambo', 'phone' => '+265992100008', 'role' => 'transport_officer'],
                ['email' => 'nurse@horizon.demo', 'name' => 'Sister Bridget Namondwe', 'phone' => '+265992100009', 'role' => 'nurse'],
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
            // 4. International Curriculum: Year 7 to Year 11 & Subjects
            // ─────────────────────────────────────────────────────────────────
            $gradeDefinitions = [
                ['code' => 'YEAR-7', 'label' => 'Year 7', 'sort_order' => 1],
                ['code' => 'YEAR-8', 'label' => 'Year 8', 'sort_order' => 2],
                ['code' => 'YEAR-9', 'label' => 'Year 9', 'sort_order' => 3],
                ['code' => 'YEAR-10', 'label' => 'Year 10 (IGCSE 1)', 'sort_order' => 4],
                ['code' => 'YEAR-11', 'label' => 'Year 11 (IGCSE 2)', 'sort_order' => 5],
            ];
            $gradeLevels = [];
            foreach ($gradeDefinitions as $gd) {
                $gradeLevels[$gd['code']] = GradeLevel::query()->updateOrCreate(
                    ['school_id' => $school->id, 'code' => $gd['code']],
                    ['label' => $gd['label'], 'sort_order' => $gd['sort_order']]
                );
            }

            $subjectDefinitions = [
                ['code' => 'CAM-MATH', 'name' => 'Cambridge Mathematics', 'weight' => 1.2],
                ['code' => 'CAM-ENG', 'name' => 'English Language & Literature', 'weight' => 1.1],
                ['code' => 'CAM-PHY', 'name' => 'Physics (IGCSE)', 'weight' => 1.1],
                ['code' => 'CAM-CHEM', 'name' => 'Chemistry (IGCSE)', 'weight' => 1.1],
                ['code' => 'CAM-BIO', 'name' => 'Biology (IGCSE)', 'weight' => 1.1],
                ['code' => 'CAM-CS', 'name' => 'Computer Science (Python & Web)', 'weight' => 1.2],
                ['code' => 'CAM-BUS', 'name' => 'Business Studies & Economics', 'weight' => 1.0],
                ['code' => 'CAM-HIST', 'name' => 'World History & Global Perspectives', 'weight' => 1.0],
                ['code' => 'CAM-FREN', 'name' => 'French Foreign Language', 'weight' => 1.0],
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
                'YEAR-7' => ['streams' => ['Cambridge', 'Oxford'], 'rooms' => ['West Wing · 201', 'West Wing · 202']],
                'YEAR-8' => ['streams' => ['Cambridge', 'Oxford'], 'rooms' => ['West Wing · 203', 'West Wing · 204']],
                'YEAR-9' => ['streams' => ['Cambridge', 'Oxford'], 'rooms' => ['Main Quad · 101', 'Main Quad · 102']],
                'YEAR-10' => ['streams' => ['Sciences', 'Humanities'], 'rooms' => ['Main Quad · 201', 'Main Quad · 202']],
                'YEAR-11' => ['streams' => ['Sciences', 'Humanities'], 'rooms' => ['Science Block · 301', 'Science Block · 302']],
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
            $sampleClass = $classGroups['current_YEAR-10_Sciences'];
            $coreSubjs = [$subjects['CAM-MATH'], $subjects['CAM-PHY'], $subjects['CAM-CHEM'], $subjects['CAM-CS']];
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            foreach ($days as $dIdx => $day) {
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '08:00:00', 'end_time' => '08:50:00'],
                    ['subject_id' => $coreSubjs[$dIdx % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[0]->id, 'room' => 'Main Quad · 201']
                );
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '08:55:00', 'end_time' => '09:45:00'],
                    ['subject_id' => $coreSubjs[($dIdx + 1) % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[1]->id, 'room' => 'Main Quad · 201']
                );
            }

            // ─────────────────────────────────────────────────────────────────
            // 6. Fee Structures (International Cambridge Tuition)
            // ─────────────────────────────────────────────────────────────────
            $pastFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $pastYear->id, 'name' => 'Cambridge Secondary Tuition 2024/2025'],
                [
                    'description' => 'Tuition, Cambridge resources, lab access, and digital learning platforms',
                    'components' => [
                        ['label' => 'Cambridge Tuition', 'amount' => 580_000],
                        ['label' => 'STEM & Robotics Lab', 'amount' => 50_000],
                        ['label' => 'Extracurricular & Arts', 'amount' => 25_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            $currentFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $currentYear->id, 'name' => 'Cambridge Secondary Tuition 2025/2026'],
                [
                    'description' => 'Comprehensive IGCSE academic package and sports facilities',
                    'components' => [
                        ['label' => 'Cambridge Tuition', 'amount' => 680_000],
                        ['label' => 'STEM & Robotics Lab', 'amount' => 65_000],
                        ['label' => 'ICT & Cloud Learning Stack', 'amount' => 45_000],
                        ['label' => 'Health & Sports Amenities', 'amount' => 30_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 7. Student Population Across All Classes (Year 7 - 11)
            // ─────────────────────────────────────────────────────────────────
            $studentsData = [
                // Year 10 Sciences (Featured primary student)
                [
                    'adm' => 'HIS-25001', 'reg' => 'REG/HIS/2024/101', 'first' => 'Talandira', 'last' => 'Kachale',
                    'gender' => 'female', 'dob' => '2009-08-14', 'grade' => 'YEAR-10', 'stream' => 'Sciences',
                    'parent_email' => 'parent@horizon.demo', 'parent_name' => 'Dr. Mwiza Kachale', 'parent_phone' => '+265992100010',
                    'student_email' => 'student@horizon.demo', 'family' => 'Kachale Family', 'district' => 'Blantyre', 'area' => 'Nyambadwe',
                    'is_boarder' => false,
                ],
                [
                    'adm' => 'HIS-25002', 'reg' => 'REG/HIS/2024/102', 'first' => 'Rohan', 'last' => 'Patel',
                    'gender' => 'male', 'dob' => '2009-11-20', 'grade' => 'YEAR-10', 'stream' => 'Sciences',
                    'parent_email' => 'parent2@horizon.demo', 'parent_name' => 'Rajesh Patel', 'parent_phone' => '+265992100021',
                    'student_email' => 'student2@horizon.demo', 'family' => 'Patel Family', 'district' => 'Blantyre', 'area' => 'Sunnyside',
                    'is_boarder' => false,
                ],
                // Year 11 Sciences
                [
                    'adm' => 'HIS-25003', 'reg' => 'REG/HIS/2023/089', 'first' => 'Mayamiko', 'last' => 'Singano',
                    'gender' => 'male', 'dob' => '2008-04-10', 'grade' => 'YEAR-11', 'stream' => 'Sciences',
                    'parent_email' => 'parent3@horizon.demo', 'parent_name' => 'Evelyn Singano', 'parent_phone' => '+265992100022',
                    'student_email' => 'student3@horizon.demo', 'family' => 'Singano Family', 'district' => 'Blantyre', 'area' => 'Namiwawa',
                    'is_boarder' => true,
                ],
                // Year 9 Cambridge
                [
                    'adm' => 'HIS-25004', 'reg' => 'REG/HIS/2024/114', 'first' => 'Favour', 'last' => 'Msiska',
                    'gender' => 'female', 'dob' => '2010-09-05', 'grade' => 'YEAR-9', 'stream' => 'Cambridge',
                    'parent_email' => 'parent4@horizon.demo', 'parent_name' => 'Kennedy Msiska', 'parent_phone' => '+265992100023',
                    'student_email' => 'student4@horizon.demo', 'family' => 'Msiska Family', 'district' => 'Blantyre', 'area' => 'Mandala',
                    'is_boarder' => false,
                ],
                // Year 8 Cambridge
                [
                    'adm' => 'HIS-25005', 'reg' => 'REG/HIS/2025/022', 'first' => 'Nathan', 'last' => 'Chiluba',
                    'gender' => 'male', 'dob' => '2011-03-17', 'grade' => 'YEAR-8', 'stream' => 'Cambridge',
                    'parent_email' => 'parent5@horizon.demo', 'parent_name' => 'Grace Chiluba', 'parent_phone' => '+265992100024',
                    'student_email' => 'student5@horizon.demo', 'family' => 'Chiluba Family', 'district' => 'Blantyre', 'area' => 'Mount Pleasant',
                    'is_boarder' => true,
                ],
                // Year 7 Oxford
                [
                    'adm' => 'HIS-25006', 'reg' => 'REG/HIS/2025/045', 'first' => 'Wongani', 'last' => 'Gama',
                    'gender' => 'female', 'dob' => '2012-07-29', 'grade' => 'YEAR-7', 'stream' => 'Oxford',
                    'parent_email' => 'parent6@horizon.demo', 'parent_name' => 'Moses Gama', 'parent_phone' => '+265992100025',
                    'student_email' => 'student6@horizon.demo', 'family' => 'Gama Family', 'district' => 'Blantyre', 'area' => 'Nyambadwe',
                    'is_boarder' => false,
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
                        'verified_at' => Carbon::now()->subMonths(16),
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
                        'phone' => '+265992' . str_pad((string)(200000 + $sIdx), 6, '0', STR_PAD_LEFT),
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
                            'clubs' => ['Model United Nations', 'Robotics Society', 'Swimming'],
                            'house' => $sIdx % 2 === 0 ? 'Newton House' : 'Rutherford House',
                        ],
                    ]
                );

                // Student Address
                StudentAddress::query()->updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'phone_number' => $sd['parent_phone'],
                        'email' => $sd['student_email'],
                        'house_number' => 'Plot ' . rand(15, 120),
                        'street_name' => 'Nyambadwe Avenue',
                        'area_village' => $sd['area'],
                        'district' => $sd['district'],
                        'city_town' => 'Blantyre',
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
                    'YEAR-11' => 'YEAR-10',
                    'YEAR-10' => 'YEAR-9',
                    'YEAR-9' => 'YEAR-8',
                    'YEAR-8' => 'YEAR-7',
                    'YEAR-7' => 'YEAR-7',
                ];
                $pastGCode = $pastGradeMap[$sd['grade']];
                $pastCg = $classGroups["past_{$pastGCode}_{$sd['stream']}"] ?? $classGroups["past_YEAR-7_Cambridge"];

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
                ['term' => $pastTerm1, 'year' => $pastYear, 'name' => 'Autumn Term 2024'],
                ['term' => $pastTerm2, 'year' => $pastYear, 'name' => 'Spring Term 2025'],
                ['term' => $pastTerm3, 'year' => $pastYear, 'name' => 'Summer Term 2025'],
                ['term' => $currentTerm1, 'year' => $currentYear, 'name' => 'Autumn Term 2025'],
                ['term' => $currentTerm2, 'year' => $currentYear, 'name' => 'Spring Term 2026'],
            ];

            foreach ($operatingTerms as $tInfo) {
                $termObj = $tInfo['term'];
                $yearObj = $tInfo['year'];

                foreach (['CAM-MATH', 'CAM-ENG', 'CAM-PHY', 'CAM-CS'] as $subCode) {
                    $subj = $subjects[$subCode];
                    $sampleCg = $classGroups['current_YEAR-10_Sciences'];

                    $midAssessment = Assessment::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $yearObj->id,
                            'term_id' => $termObj->id,
                            'subject_id' => $subj->id,
                            'class_group_id' => $sampleCg->id,
                            'title' => "{$tInfo['name']} Mid-Term Assessment - {$subj->name}",
                        ],
                        [
                            'type' => 'Coursework',
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
                            'title' => "{$tInfo['name']} End of Term IGCSE Mock - {$subj->name}",
                        ],
                        [
                            'type' => 'Exam',
                            'max_score' => 100,
                            'weight' => 70,
                            'due_at' => $termObj->ends_on->copy()->subDays(5),
                        ]
                    );

                    // Add marks for Year 10 students
                    foreach ([$createdStudents[0], $createdStudents[1]] as $stEntry) {
                        $scoreMid = rand(75, 96);
                        $scoreEnd = rand(78, 98);

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $midAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreMid,
                                'grade' => $scoreMid >= 85 ? 'A*' : ($scoreMid >= 75 ? 'A' : 'B'),
                                'comment' => 'Outstanding critical analysis and analytical reasoning.',
                            ]
                        );

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $endAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreEnd,
                                'grade' => $scoreEnd >= 85 ? 'A*' : ($scoreEnd >= 75 ? 'A' : 'B'),
                                'comment' => 'Exceptional performance in theoretical and practical examination.',
                            ]
                        );
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 9. Attendance Sessions & Records (Past Weeks to Current Day)
            // ─────────────────────────────────────────────────────────────────
            $sampleClass = $classGroups['current_YEAR-10_Sciences'];
            $teacherGondwe = $staffUsers['teacher'];

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
                        'marked_by' => $teacherGondwe->id,
                        'method' => 'manual',
                        'source' => 'teacher_tablet',
                    ]
                );

                foreach ([$createdStudents[0], $createdStudents[1]] as $stEntry) {
                    StudentAttendanceRecord::query()->updateOrCreate(
                        ['session_id' => $session->id, 'student_id' => $stEntry['model']->id],
                        [
                            'status' => 'present',
                            'arrived_at' => $checkDate->copy()->setTime(7, 45 + rand(0, 10)),
                            'notes' => 'Punctual',
                        ]
                    );
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 10. Financial Operations: Invoices Across 5 Terms & Bank Payments
            // ─────────────────────────────────────────────────────────────────
            $accountantUser = $staffUsers['accountant'];
            $mainStudent = $createdStudents[0]['model'];

            $termsInvoiceData = [
                ['term' => 'Autumn Term 2024', 'fee' => $pastFee, 'num' => 'INV-HIS-2401', 'total' => 655_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2024, 9, 10)],
                ['term' => 'Spring Term 2025', 'fee' => $pastFee, 'num' => 'INV-HIS-2501', 'total' => 655_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 1, 10)],
                ['term' => 'Summer Term 2025', 'fee' => $pastFee, 'num' => 'INV-HIS-2502', 'total' => 655_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 5, 10)],
                ['term' => 'Autumn Term 2025', 'fee' => $currentFee, 'num' => 'INV-HIS-2503', 'total' => 820_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 9, 8)],
                ['term' => 'Spring Term 2026', 'fee' => $currentFee, 'num' => 'INV-HIS-2601', 'total' => 820_000, 'balance' => 200_000, 'status' => 'partial', 'date' => Carbon::create(2026, 1, 12)],
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
                    ['invoice_id' => $invoice->id, 'description' => "Tuition & IGCSE science levies for {$invD['term']}"],
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
                            'paid_at' => $invD['date']->copy()->addDays(4),
                            'provider_payload' => [
                                'bank' => 'National Bank of Malawi',
                                'account' => '1004829104',
                                'branch' => 'Victoria Avenue Branch',
                                'tx_code' => 'NBM-FT-' . rand(100000, 999999),
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
                    'title' => 'Cambridge IGCSE June 2026 Registration Notice',
                    'body' => 'Entries for the May/June Cambridge IGCSE examination series are now finalizing. Parents of Year 11 candidates are advised to verify statement of entries on the portal.',
                    'audience' => ['parents', 'students', 'teachers'],
                    'date' => Carbon::now()->subDays(5),
                ],
                [
                    'title' => 'Annual Southern Africa Model United Nations Conference',
                    'body' => 'Horizon International delegates departed this morning for the regional MUN conference in Lusaka, Zambia. We wish our debating delegation outstanding diplomatic sessions.',
                    'audience' => ['parents', 'students'],
                    'date' => Carbon::now()->subWeeks(3),
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
                ['title' => 'Spring Half-Term Break', 'type' => 'holiday', 'start' => Carbon::now()->addDays(10)->toDateString(), 'end' => Carbon::now()->addDays(15)->toDateString(), 'is_holiday' => true],
                ['title' => 'Cambridge Science & Innovation Fair', 'type' => 'exhibition', 'start' => Carbon::now()->addDays(28)->toDateString(), 'end' => null, 'is_holiday' => false],
            ];
            foreach ($calendarEvents as $ce) {
                SchoolCalendarEvent::query()->updateOrCreate(
                    ['school_id' => $school->id, 'title' => $ce['title']],
                    [
                        'description' => "Event: {$ce['title']}",
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
                    'subject' => 'Physics IGCSE Practical Lab Session Schedule',
                ],
                [
                    'student_id' => $mainStudent->id,
                    'body' => 'Dear Mr. Gondwe, Talandira mentioned additional Saturday mock practicals for electricity and mechanics. Could you please confirm the timetable?',
                    'read_at' => Carbon::now()->subDay(),
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 12. Student Welfare, Clinic, Awards & Documents
            // ─────────────────────────────────────────────────────────────────
            ClinicVisit::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'date' => Carbon::now()->subWeeks(2)->toDateString()],
                [
                    'condition' => 'Sprained Ankle during Tennis Practice',
                    'action' => 'Applied cold ice compress, crepe bandage support, administered Ibuprofen 400mg.',
                    'notes' => 'Excused from physical education for 1 week.',
                ]
            );

            StudentAward::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'title' => 'Best Delegate - Model United Nations General Assembly'],
                [
                    'category' => 'Leadership & Debating',
                    'date' => Carbon::create(2025, 10, 15)->toDateString(),
                    'description' => 'Represented the Committee on Sustainable Development with highest commendation.',
                ]
            );

            StudentDocument::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'document_type' => 'Cambridge Checkpoint Results Certificate'],
                ['file_path' => '/storage/documents/HIS_CHECKPOINT_2024.pdf', 'file_name' => 'Cambridge_Checkpoint_Year9.pdf']
            );

            // ─────────────────────────────────────────────────────────────────
            // 13. Hostel Facilities & Boarding Allocations
            // ─────────────────────────────────────────────────────────────────
            $hostelWing = HostelRoom::query()->updateOrCreate(
                ['school_id' => $school->id, 'room_number' => 'N-101'],
                [
                    'block' => 'Nyambadwe Boarding Lodge (Boys)',
                    'gender' => 'male',
                    'capacity' => 2,
                    'floor' => 1,
                    'facilities' => 'Ensuite bathroom, individual study stations, Wi-Fi connectivity',
                ]
            );

            HostelAllocation::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'student_id' => $createdStudents[2]['model']->id, // Mayamiko Singano
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    'hostel_room_id' => $hostelWing->id,
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
                ['registration' => 'BT 3810'],
                [
                    'school_id' => $school->id,
                    'make' => 'Mercedes-Benz',
                    'model' => 'Sprinter 22-Seater VIP',
                    'year' => 2023,
                    'capacity' => 22,
                    'driver_name' => 'Kamoto Banda',
                    'driver_phone' => '+265888200300',
                    'status' => 'active',
                ]
            );

            $route = TransportRoute::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Route A: Sunnyside · Mandala · Nyambadwe'],
                [
                    'vehicle_id' => $vehicle->id,
                    'direction' => 'both',
                    'pickup_points' => [
                        ['name' => 'Sunnyside Protea Ryalls Corner', 'time' => '07:00 AM'],
                        ['name' => 'Mandala Heritage Roundabout', 'time' => '07:15 AM'],
                        ['name' => 'Nyambadwe Heights Gate', 'time' => '07:30 AM'],
                    ],
                ]
            );

            StudentTransport::query()->updateOrCreate(
                [
                    'student_id' => $mainStudent->id,
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    'school_id' => $school->id,
                    'transport_route_id' => $route->id,
                    'pickup_point' => 'Mandala Heritage Roundabout',
                    'is_active' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 15. Library Books & Borrowings
            // ─────────────────────────────────────────────────────────────────
            $booksData = [
                ['title' => 'Cambridge IGCSE Physics Coursebook (4th Edition)', 'author' => 'David Sang', 'isbn' => '9781107614582', 'cat' => 'Sciences', 'copies' => 25, 'shelf' => 'Shelf C-01'],
                ['title' => 'Cambridge IGCSE Computer Science', 'author' => 'David Watson & Helen Williams', 'isbn' => '9781471809309', 'cat' => 'Computing', 'copies' => 20, 'shelf' => 'Shelf C-04'],
                ['title' => 'The Great Gatsby', 'author' => 'F. Scott Fitzgerald', 'isbn' => '9780743273565', 'cat' => 'World Literature', 'copies' => 35, 'shelf' => 'Shelf L-03'],
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

                if ($bd['cat'] === 'Sciences') {
                    BookBorrowing::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'book_id' => $book->id,
                            'borrower_type' => Student::class,
                            'borrower_id' => $mainStudent->id,
                        ],
                        [
                            'issued_by' => $staffUsers['librarian']->id,
                            'issued_on' => Carbon::now()->subDays(8)->toDateString(),
                            'due_on' => Carbon::now()->addDays(6)->toDateString(),
                            'returned_on' => null,
                            'fine_amount' => 0,
                            'status' => 'active',
                        ]
                    );
                }
            }
        });

        $this->command?->info('✅ Horizon International School seeded with 5 operating terms & full operations.');
    }
}

