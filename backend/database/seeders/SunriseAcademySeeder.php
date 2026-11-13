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

class SunriseAcademySeeder extends Seeder
{
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        DB::transaction(function (): void {
            // ─────────────────────────────────────────────────────────────────
            // 1. School & Campus Profile
            // ─────────────────────────────────────────────────────────────────
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
                        'accent' => '#4f46e5',
                    ],
                ]
            );

            $campus = Campus::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Main Campus'],
                [
                    'address' => 'Plot 47/218, Area 47 Sector 4, Lilongwe, Malawi',
                    'phone' => '+265 1 772 300',
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 2. Academic Years & 6 Terms (5 Operating Terms)
            // ─────────────────────────────────────────────────────────────────
            // Past Year: 2024 / 2025 (Completed: 3 Terms)
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

            // Current Year: 2025 / 2026 (Term 1 past, Term 2 active, Term 3 scheduled)
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
            // 3. Staff Users & Specific System Roles
            // ─────────────────────────────────────────────────────────────────
            $usersData = [
                ['email' => 'director@sunrise.demo', 'name' => 'Dr. Chisomo Banda', 'phone' => '+265991100001', 'role' => 'school_director'],
                ['email' => 'admin@sunrise.demo', 'name' => 'Thandiwe Phiri', 'phone' => '+265991100002', 'role' => 'school_admin'],
                ['email' => 'finance@sunrise.demo', 'name' => 'Kondwani Mwale', 'phone' => '+265991100003', 'role' => 'accountant'],
                ['email' => 'registrar@sunrise.demo', 'name' => 'Alinafe Chirwa', 'phone' => '+265991100004', 'role' => 'registrar'],
                ['email' => 'teacher@sunrise.demo', 'name' => 'Dalitso Nkosi', 'phone' => '+265991100005', 'role' => 'teacher'],
                ['email' => 'teacher2@sunrise.demo', 'name' => 'Mercy Chibambo', 'phone' => '+265991100015', 'role' => 'teacher'],
                ['email' => 'teacher3@sunrise.demo', 'name' => 'Patrick Kaunda', 'phone' => '+265991100016', 'role' => 'teacher'],
                ['email' => 'teacher4@sunrise.demo', 'name' => 'Grace Gondwe', 'phone' => '+265991100017', 'role' => 'teacher'],
                ['email' => 'library@sunrise.demo', 'name' => 'Lusungu Tembo', 'phone' => '+265991100006', 'role' => 'librarian'],
                ['email' => 'hostel@sunrise.demo', 'name' => 'Mphatso Gondwe', 'phone' => '+265991100007', 'role' => 'hostel_master'],
                ['email' => 'transport@sunrise.demo', 'name' => 'Yankho Kumwenda', 'phone' => '+265991100008', 'role' => 'transport_officer'],
                ['email' => 'nurse@sunrise.demo', 'name' => 'Tionge Mvula', 'phone' => '+265991100009', 'role' => 'nurse'],
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
                if ($u['email'] === 'teacher@sunrise.demo') {
                    $staffUsers['head_teacher'] = $user;
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 4. Academic Curriculum: Grade Levels, Subjects & Classes
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
                ['code' => 'MATH', 'name' => 'Mathematics', 'weight' => 1.2],
                ['code' => 'ENG', 'name' => 'English Language', 'weight' => 1.0],
                ['code' => 'BIO', 'name' => 'Biology', 'weight' => 1.1],
                ['code' => 'PHYS', 'name' => 'Physical Science', 'weight' => 1.1],
                ['code' => 'CHEM', 'name' => 'Chemistry', 'weight' => 1.1],
                ['code' => 'GEO', 'name' => 'Geography', 'weight' => 1.0],
                ['code' => 'HIST', 'name' => 'History', 'weight' => 1.0],
                ['code' => 'AGRI', 'name' => 'Agriculture', 'weight' => 1.0],
                ['code' => 'COMP', 'name' => 'Computer Studies', 'weight' => 1.1],
                ['code' => 'CHIC', 'name' => 'Chichewa Language', 'weight' => 1.0],
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
                'FORM-1' => ['streams' => ['Gold', 'Silver'], 'rooms' => ['Block A · 101', 'Block A · 102']],
                'FORM-2' => ['streams' => ['Gold', 'Silver'], 'rooms' => ['Block A · 201', 'Block A · 202']],
                'FORM-3' => ['streams' => ['Sapphire', 'Emerald'], 'rooms' => ['Block B · 101', 'Block B · 102']],
                'FORM-4' => ['streams' => ['Sapphire', 'Emerald'], 'rooms' => ['Block B · 201', 'Block B · 202']],
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

                    // Create Stream entity
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

            // Subject Allocations for Teachers
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
            // 5. Timetable Periods for Core Classes
            // ─────────────────────────────────────────────────────────────────
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            $sampleClass = $classGroups['current_FORM-3_Sapphire'];
            $coreSubjs = [$subjects['MATH'], $subjects['ENG'], $subjects['BIO'], $subjects['PHYS'], $subjects['COMP']];

            foreach ($days as $dIdx => $day) {
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '07:45:00', 'end_time' => '08:30:00'],
                    ['subject_id' => $coreSubjs[$dIdx % count($coreSubjs)]->id, 'teacher_id' => $staffUsers['teacher']->id, 'room' => 'Block B · 101']
                );
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '08:30:00', 'end_time' => '09:15:00'],
                    ['subject_id' => $coreSubjs[($dIdx + 1) % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[1]->id, 'room' => 'Block B · 101']
                );
                TimetablePeriod::query()->updateOrCreate(
                    ['class_group_id' => $sampleClass->id, 'day_of_week' => $day, 'start_time' => '09:45:00', 'end_time' => '10:30:00'],
                    ['subject_id' => $coreSubjs[($dIdx + 2) % count($coreSubjs)]->id, 'teacher_id' => $teacherPool[2]->id, 'room' => 'Science Lab 1']
                );
            }

            // ─────────────────────────────────────────────────────────────────
            // 6. Fee Structures (Past 2024/25 & Current 2025/26)
            // ─────────────────────────────────────────────────────────────────
            $pastFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $pastYear->id, 'name' => 'Secondary Tuition 2024/2025'],
                [
                    'description' => 'Standard secondary academic tuition and development fund',
                    'components' => [
                        ['label' => 'Tuition Fee', 'amount' => 320_000],
                        ['label' => 'ICT & Computer Lab', 'amount' => 20_000],
                        ['label' => 'Library & Resource Fund', 'amount' => 15_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            $currentFee = FeeStructure::query()->updateOrCreate(
                ['school_id' => $school->id, 'academic_year_id' => $currentYear->id, 'name' => 'Secondary Tuition 2025/2026'],
                [
                    'description' => 'Tuition, science/ICT levies, and learner welfare package',
                    'components' => [
                        ['label' => 'Tuition Fee', 'amount' => 380_000],
                        ['label' => 'ICT Levy & Portal Access', 'amount' => 30_000],
                        ['label' => 'Science Practical Lab Fee', 'amount' => 25_000],
                        ['label' => 'Medical & Sports Levy', 'amount' => 15_000],
                    ],
                    'allow_installments' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 7. Student Population Across All Classes & Streams
            // ─────────────────────────────────────────────────────────────────
            $studentsData = [
                // Form 3 Sapphire (Featured main student + peers)
                [
                    'adm' => 'SA-260001', 'reg' => 'REG/SA/2024/001', 'first' => 'Chimwemwe', 'last' => 'Kamanga',
                    'gender' => 'female', 'dob' => '2010-04-12', 'grade' => 'FORM-3', 'stream' => 'Sapphire',
                    'parent_email' => 'parent@sunrise.demo', 'parent_name' => 'Blessings Kamanga', 'parent_phone' => '+265991100010',
                    'student_email' => 'student@sunrise.demo', 'family' => 'Kamanga Family', 'district' => 'Lilongwe', 'area' => 'Area 47',
                    'is_boarder' => false,
                ],
                [
                    'adm' => 'SA-260002', 'reg' => 'REG/SA/2024/002', 'first' => 'Tawonga', 'last' => 'Chirwa',
                    'gender' => 'male', 'dob' => '2010-06-18', 'grade' => 'FORM-3', 'stream' => 'Sapphire',
                    'parent_email' => 'parent2@sunrise.demo', 'parent_name' => 'Maclean Chirwa', 'parent_phone' => '+265991100021',
                    'student_email' => 'student2@sunrise.demo', 'family' => 'Chirwa Family', 'district' => 'Lilongwe', 'area' => 'Area 10',
                    'is_boarder' => true,
                ],
                // Form 3 Emerald
                [
                    'adm' => 'SA-260003', 'reg' => 'REG/SA/2024/003', 'first' => 'Kondwani', 'last' => 'Phiri',
                    'gender' => 'male', 'dob' => '2010-02-14', 'grade' => 'FORM-3', 'stream' => 'Emerald',
                    'parent_email' => 'parent3@sunrise.demo', 'parent_name' => 'Esther Phiri', 'parent_phone' => '+265991100022',
                    'student_email' => 'student3@sunrise.demo', 'family' => 'Phiri Family', 'district' => 'Lilongwe', 'area' => 'Area 14',
                    'is_boarder' => false,
                ],
                [
                    'adm' => 'SA-260004', 'reg' => 'REG/SA/2024/004', 'first' => 'Limbani', 'last' => 'Manda',
                    'gender' => 'female', 'dob' => '2010-08-25', 'grade' => 'FORM-3', 'stream' => 'Emerald',
                    'parent_email' => 'parent4@sunrise.demo', 'parent_name' => 'George Manda', 'parent_phone' => '+265991100023',
                    'student_email' => 'student4@sunrise.demo', 'family' => 'Manda Family', 'district' => 'Lilongwe', 'area' => 'Area 18',
                    'is_boarder' => true,
                ],
                // Form 4 Sapphire
                [
                    'adm' => 'SA-260005', 'reg' => 'REG/SA/2023/005', 'first' => 'Yamikani', 'last' => 'Banda',
                    'gender' => 'male', 'dob' => '2009-01-10', 'grade' => 'FORM-4', 'stream' => 'Sapphire',
                    'parent_email' => 'parent5@sunrise.demo', 'parent_name' => 'Ephraim Banda', 'parent_phone' => '+265991100024',
                    'student_email' => 'student5@sunrise.demo', 'family' => 'Banda Family', 'district' => 'Lilongwe', 'area' => 'Area 43',
                    'is_boarder' => false,
                ],
                // Form 4 Emerald
                [
                    'adm' => 'SA-260006', 'reg' => 'REG/SA/2023/006', 'first' => 'Memory', 'last' => 'Matola',
                    'gender' => 'female', 'dob' => '2009-05-30', 'grade' => 'FORM-4', 'stream' => 'Emerald',
                    'parent_email' => 'parent6@sunrise.demo', 'parent_name' => 'Rose Matola', 'parent_phone' => '+265991100025',
                    'student_email' => 'student6@sunrise.demo', 'family' => 'Matola Family', 'district' => 'Lilongwe', 'area' => 'Area 9',
                    'is_boarder' => true,
                ],
                // Form 2 Gold
                [
                    'adm' => 'SA-260007', 'reg' => 'REG/SA/2024/007', 'first' => 'Madalitso', 'last' => 'Kanyama',
                    'gender' => 'male', 'dob' => '2011-09-12', 'grade' => 'FORM-2', 'stream' => 'Gold',
                    'parent_email' => 'parent7@sunrise.demo', 'parent_name' => 'Timothy Kanyama', 'parent_phone' => '+265991100026',
                    'student_email' => 'student7@sunrise.demo', 'family' => 'Kanyama Family', 'district' => 'Lilongwe', 'area' => 'Area 25',
                    'is_boarder' => false,
                ],
                // Form 2 Silver
                [
                    'adm' => 'SA-260008', 'reg' => 'REG/SA/2024/008', 'first' => 'Chikondi', 'last' => 'Nyirenda',
                    'gender' => 'female', 'dob' => '2011-11-04', 'grade' => 'FORM-2', 'stream' => 'Silver',
                    'parent_email' => 'parent8@sunrise.demo', 'parent_name' => 'Chisomo Nyirenda', 'parent_phone' => '+265991100027',
                    'student_email' => 'student8@sunrise.demo', 'family' => 'Nyirenda Family', 'district' => 'Lilongwe', 'area' => 'Area 3',
                    'is_boarder' => true,
                ],
                // Form 1 Gold
                [
                    'adm' => 'SA-260009', 'reg' => 'REG/SA/2025/009', 'first' => 'Hope', 'last' => 'Zimba',
                    'gender' => 'female', 'dob' => '2012-03-21', 'grade' => 'FORM-1', 'stream' => 'Gold',
                    'parent_email' => 'parent9@sunrise.demo', 'parent_name' => 'Francis Zimba', 'parent_phone' => '+265991100028',
                    'student_email' => 'student9@sunrise.demo', 'family' => 'Zimba Family', 'district' => 'Lilongwe', 'area' => 'Area 12',
                    'is_boarder' => false,
                ],
                // Form 1 Silver
                [
                    'adm' => 'SA-260010', 'reg' => 'REG/SA/2025/010', 'first' => 'Brian', 'last' => 'Chirambo',
                    'gender' => 'male', 'dob' => '2012-07-15', 'grade' => 'FORM-1', 'stream' => 'Silver',
                    'parent_email' => 'parent10@sunrise.demo', 'parent_name' => 'Joyce Chirambo', 'parent_phone' => '+265991100029',
                    'student_email' => 'student10@sunrise.demo', 'family' => 'Chirambo Family', 'district' => 'Lilongwe', 'area' => 'Area 49',
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
                        'phone' => '+265991' . str_pad((string)(200000 + $sIdx), 6, '0', STR_PAD_LEFT),
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
                            'clubs' => ['Debate Society', 'Science & Innovation', 'Football'],
                            'house' => $sIdx % 2 === 0 ? 'Chintheche House' : 'Mulanje House',
                        ],
                    ]
                );

                // Student Address
                StudentAddress::query()->updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'phone_number' => $sd['parent_phone'],
                        'email' => $sd['student_email'],
                        'house_number' => 'Plot ' . rand(10, 300),
                        'street_name' => 'Chilambula Road',
                        'area_village' => $sd['area'],
                        'district' => $sd['district'],
                        'city_town' => 'Lilongwe',
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
                // If student was in Form 3, they were in Form 2 last year; Form 4 was in Form 3 last year, etc.
                $pastGradeMap = [
                    'FORM-4' => 'FORM-3',
                    'FORM-3' => 'FORM-2',
                    'FORM-2' => 'FORM-1',
                    'FORM-1' => 'FORM-1',
                ];
                $pastGradeCode = $pastGradeMap[$sd['grade']];
                $pastClassGroup = $classGroups["past_{$pastGradeCode}_{$sd['stream']}"] ?? $classGroups["past_FORM-1_Gold"];

                StudentEnrollment::query()->updateOrCreate(
                    ['student_id' => $student->id, 'academic_year_id' => $pastYear->id],
                    [
                        'school_id' => $school->id,
                        'class_group_id' => $pastClassGroup->id,
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

            foreach ($operatingTerms as $tIndex => $tInfo) {
                $termObj = $tInfo['term'];
                $yearObj = $tInfo['year'];

                foreach (['MATH', 'ENG', 'BIO', 'COMP'] as $subCode) {
                    $subj = $subjects[$subCode];
                    $sampleCg = $classGroups['current_FORM-3_Sapphire'];

                    // Mid-Term Assessment
                    $midAssessment = Assessment::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $yearObj->id,
                            'term_id' => $termObj->id,
                            'subject_id' => $subj->id,
                            'class_group_id' => $sampleCg->id,
                            'title' => "{$tInfo['name']} Mid-Term Test - {$subj->name}",
                        ],
                        [
                            'type' => 'Test',
                            'max_score' => 100,
                            'weight' => 30,
                            'due_at' => $termObj->starts_on->copy()->addWeeks(6),
                        ]
                    );

                    // End-Term Exam
                    $endAssessment = Assessment::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'academic_year_id' => $yearObj->id,
                            'term_id' => $termObj->id,
                            'subject_id' => $subj->id,
                            'class_group_id' => $sampleCg->id,
                            'title' => "{$tInfo['name']} End of Term Examination - {$subj->name}",
                        ],
                        [
                            'type' => 'Exam',
                            'max_score' => 100,
                            'weight' => 70,
                            'due_at' => $termObj->ends_on->copy()->subDays(5),
                        ]
                    );

                    // Add marks for Form 3 Sapphire students (Student 0 & 1)
                    foreach ([$createdStudents[0], $createdStudents[1]] as $stEntry) {
                        $scoreMid = rand(72, 95);
                        $scoreEnd = rand(70, 96);

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $midAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreMid,
                                'grade' => $scoreMid >= 85 ? 'A+' : ($scoreMid >= 75 ? 'A' : 'B+'),
                                'comment' => 'Solid understanding of core curriculum principles.',
                            ]
                        );

                        AssessmentMark::query()->updateOrCreate(
                            ['school_id' => $school->id, 'assessment_id' => $endAssessment->id, 'student_id' => $stEntry['model']->id],
                            [
                                'score' => $scoreEnd,
                                'grade' => $scoreEnd >= 85 ? 'A+' : ($scoreEnd >= 75 ? 'A' : 'B+'),
                                'comment' => 'Commendable performance in exam assessments.',
                            ]
                        );
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 9. Attendance Sessions & Records (Past Weeks to Current Day)
            // ─────────────────────────────────────────────────────────────────
            $sampleClass = $classGroups['current_FORM-3_Sapphire'];
            $teacherDalitso = $staffUsers['teacher'];

            for ($daysBack = 15; $daysBack >= 0; $daysBack--) {
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
                        'marked_by' => $teacherDalitso->id,
                        'method' => 'manual',
                        'source' => 'teacher_mobile_app',
                    ]
                );

                foreach ([$createdStudents[0], $createdStudents[1]] as $csIdx => $stEntry) {
                    $status = 'present';
                    $arrivedAt = $checkDate->copy()->setTime(7, 30 + rand(0, 12));
                    $notes = 'On time';

                    if ($daysBack === 4 && $csIdx === 0) {
                        $status = 'late';
                        $arrivedAt = $checkDate->copy()->setTime(8, 12);
                        $notes = 'Heavy traffic on Area 47 interchange';
                    } elseif ($daysBack === 8 && $csIdx === 1) {
                        $status = 'excused';
                        $notes = 'Attending district science competition';
                    }

                    StudentAttendanceRecord::query()->updateOrCreate(
                        ['session_id' => $session->id, 'student_id' => $stEntry['model']->id],
                        [
                            'status' => $status,
                            'arrived_at' => $arrivedAt,
                            'notes' => $notes,
                        ]
                    );
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 10. Financial Operations: Invoices Across 5 Terms & Payments
            // ─────────────────────────────────────────────────────────────────
            $accountantUser = $staffUsers['accountant'];
            $mainStudent = $createdStudents[0]['model'];

            // Invoices for 5 Terms
            $termsInvoiceData = [
                ['term' => 'Term I 2024', 'fee' => $pastFee, 'num' => 'INV-SA-240101', 'total' => 355_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2024, 9, 10)],
                ['term' => 'Term II 2025', 'fee' => $pastFee, 'num' => 'INV-SA-250101', 'total' => 355_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 1, 12)],
                ['term' => 'Term III 2025', 'fee' => $pastFee, 'num' => 'INV-SA-250201', 'total' => 355_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 5, 10)],
                ['term' => 'Term I 2025', 'fee' => $currentFee, 'num' => 'INV-SA-250301', 'total' => 450_000, 'balance' => 0, 'status' => 'paid', 'date' => Carbon::create(2025, 9, 8)],
                ['term' => 'Term II 2026', 'fee' => $currentFee, 'num' => 'INV-SA-260001', 'total' => 450_000, 'balance' => 150_000, 'status' => 'partial', 'date' => Carbon::create(2026, 1, 10)],
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
                    ['invoice_id' => $invoice->id, 'description' => "Tuition & levies for {$invD['term']}"],
                    ['quantity' => 1, 'unit_price' => $invD['total'], 'tax' => 0, 'total' => $invD['total']]
                );

                // Payments for this invoice
                $paidAmount = $invD['total'] - $invD['balance'];
                if ($paidAmount > 0) {
                    $ref = 'PAY-' . str_replace('INV-', '', $invD['num']);
                    Payment::query()->firstOrCreate(
                        ['reference' => $ref],
                        [
                            'school_id' => $school->id,
                            'invoice_id' => $invoice->id,
                            'amount' => $paidAmount,
                            'method' => 'mobile_money',
                            'received_by' => $accountantUser->id,
                            'paid_at' => $invD['date']->copy()->addDays(5),
                            'provider_payload' => [
                                'provider' => 'Airtel Money',
                                'phone' => '+265991100010',
                                'transaction_id' => 'AIRTEL-' . rand(1000000, 9999999),
                            ],
                        ]
                    );
                }
            }

            // Second student invoice (Paid via TNM Mpamba)
            $studentTwo = $createdStudents[1]['model'];
            $invTwo = Invoice::query()->updateOrCreate(
                ['school_id' => $school->id, 'invoice_number' => 'INV-SA-260002'],
                [
                    'student_id' => $studentTwo->id,
                    'fee_structure_id' => $currentFee->id,
                    'currency' => 'MWK',
                    'subtotal' => 450_000,
                    'discount' => 0,
                    'total' => 450_000,
                    'balance_due' => 0,
                    'status' => 'paid',
                    'due_date' => Carbon::now()->addDays(15),
                ]
            );
            InvoiceLine::query()->firstOrCreate(
                ['invoice_id' => $invTwo->id, 'description' => 'Tuition & Boarding Package Term II 2026'],
                ['quantity' => 1, 'unit_price' => 450_000, 'tax' => 0, 'total' => 450_000]
            );
            Payment::query()->firstOrCreate(
                ['reference' => 'PAY-SA-260002'],
                [
                    'school_id' => $school->id,
                    'invoice_id' => $invTwo->id,
                    'amount' => 450_000,
                    'method' => 'mobile_money',
                    'received_by' => $accountantUser->id,
                    'paid_at' => Carbon::now()->subDays(10),
                    'provider_payload' => [
                        'provider' => 'TNM Mpamba',
                        'phone' => '+265881100021',
                        'transaction_id' => 'MPAMBA-' . rand(1000000, 9999999),
                    ],
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 11. Communication: Announcements, Calendar & Direct Portal Messages
            // ─────────────────────────────────────────────────────────────────
            $adminUser = $staffUsers['school_admin'];
            $directorUser = $staffUsers['school_director'];

            $announcements = [
                [
                    'title' => 'Term II 2026 Mid-Term Examinations Timetable Released',
                    'body' => 'Dear Parents and Learners, the official examination timetable for Term II 2026 is now accessible on the student and parent portal. Morning sessions commence punctually at 08:00 AM.',
                    'audience' => ['parents', 'students', 'teachers'],
                    'date' => Carbon::now()->subDays(3),
                ],
                [
                    'title' => 'National Science & Robotics Fair Selection',
                    'body' => 'Sunrise Academy has qualified 6 students to represent the Central Education Division at the National Science & Innovation Expo in Blantyre next month. Congratulations to our STEM team!',
                    'audience' => ['parents', 'students', 'teachers'],
                    'date' => Carbon::now()->subWeeks(2),
                ],
                [
                    'title' => 'PTA Annual General Meeting & Career Mentorship Day',
                    'body' => 'Notice is hereby given for the Annual General Meeting of the Parent-Teacher Association scheduled for Saturday, 28th March 2026 at 09:00 AM in the Great Hall.',
                    'audience' => ['parents', 'teachers'],
                    'date' => Carbon::now()->subMonth(),
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

            // Calendar Events
            $calendarEvents = [
                ['title' => 'Term II Mid-Term Break', 'type' => 'holiday', 'start' => Carbon::now()->addDays(14)->toDateString(), 'end' => Carbon::now()->addDays(18)->toDateString(), 'is_holiday' => true],
                ['title' => 'Inter-House Athletics Championship', 'type' => 'sports', 'start' => Carbon::now()->addDays(25)->toDateString(), 'end' => null, 'is_holiday' => false],
                ['title' => 'End of Term Examinations', 'type' => 'exam', 'start' => '2026-03-30', 'end' => '2026-04-08', 'is_holiday' => false],
                ['title' => 'Kamuzu Day Observed', 'type' => 'holiday', 'start' => '2026-05-14', 'end' => null, 'is_holiday' => true],
            ];
            foreach ($calendarEvents as $ce) {
                SchoolCalendarEvent::query()->updateOrCreate(
                    ['school_id' => $school->id, 'title' => $ce['title']],
                    [
                        'description' => "Official school calendar event: {$ce['title']}",
                        'event_type' => $ce['type'],
                        'start_date' => $ce['start'],
                        'end_date' => $ce['end'],
                        'is_holiday' => $ce['is_holiday'],
                    ]
                );
            }

            // Portal Direct Messages between Parent and Teacher
            $parentBlessings = $createdStudents[0]['parent'];
            $teacherDalitso = $staffUsers['teacher'];

            PortalMessage::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'from_user_id' => $parentBlessings->id,
                    'to_user_id' => $teacherDalitso->id,
                    'subject' => 'Chimwemwe’s Progress in Advanced Mathematics',
                ],
                [
                    'student_id' => $mainStudent->id,
                    'body' => 'Good day Mr. Nkosi. I reviewed Chimwemwe’s mid-term score of 88%. We would like to inquire if additional coaching for the National Mathematics Olympiad is available.',
                    'read_at' => Carbon::now()->subDays(2),
                ]
            );

            PortalMessage::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'from_user_id' => $teacherDalitso->id,
                    'to_user_id' => $parentBlessings->id,
                    'subject' => 'Re: Chimwemwe’s Progress in Advanced Mathematics',
                ],
                [
                    'student_id' => $mainStudent->id,
                    'body' => 'Greetings Mrs. Kamanga. Chimwemwe is showing great aptitude in algebra and geometry. The Olympiad prep sessions take place every Wednesday from 3:30 PM to 4:45 PM.',
                    'read_at' => Carbon::now()->subDay(),
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 12. Student Welfare, Clinic, Awards, Discipline & Documents
            // ─────────────────────────────────────────────────────────────────
            // Clinic Visit
            ClinicVisit::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'date' => Carbon::now()->subDays(6)->toDateString()],
                [
                    'condition' => 'Mild Migraine & Eye Fatigue',
                    'action' => 'Administered Paracetamol 500mg, rested in recovery ward for 90 minutes. Vision test recommended.',
                    'notes' => 'Advised to take regular breaks during computer laboratory sessions.',
                ]
            );

            // Student Awards
            StudentAward::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'title' => '1st Place - Junior Mathematics Olympiad'],
                [
                    'category' => 'Academic Distinction',
                    'date' => Carbon::create(2025, 6, 20)->toDateString(),
                    'description' => 'Awarded by the Mathematical Association of Malawi for highest score in the Lilongwe District.',
                ]
            );
            StudentAward::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'title' => 'Excellence in Science & Innovation'],
                [
                    'category' => 'STEM',
                    'date' => Carbon::create(2025, 11, 28)->toDateString(),
                    'description' => 'Solar irrigation prototype demonstration at the annual science symposium.',
                ]
            );

            // Discipline Record (resolved)
            DisciplineRecord::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'student_id' => $mainStudent->id,
                    'date' => Carbon::now()->subWeeks(5)->toDateString(),
                    'incident_type' => 'Late Arrival to Assembly',
                ],
                [
                    'reported_by' => $staffUsers['teacher']->id,
                    'description' => 'Arrived 10 minutes past the commencement of Monday morning school assembly.',
                    'action_taken' => 'Counseling and verbal reminder of punctuality protocols.',
                    'severity' => 'low',
                    'points_deducted' => 1,
                    'status' => 'resolved',
                ]
            );

            // Student Documents
            StudentDocument::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'document_type' => 'Official Admission Acceptance Letter'],
                ['file_path' => '/storage/documents/SA_ADM_260001.pdf', 'file_name' => 'SA_Admission_Letter_2024.pdf']
            );
            StudentDocument::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'document_type' => 'Primary School Leaving Certificate (PSLC)'],
                ['file_path' => '/storage/documents/PSLC_KAMANGA_C.pdf', 'file_name' => 'PSLC_National_Exam_Results.pdf']
            );
            StudentDocument::query()->updateOrCreate(
                ['student_id' => $mainStudent->id, 'document_type' => 'Certified Medical Clearance Certificate'],
                ['file_path' => '/storage/documents/MED_KAMANGA_2025.pdf', 'file_name' => 'Medical_Clearance_Lilongwe_Clinic.pdf']
            );

            // ─────────────────────────────────────────────────────────────────
            // 13. Hostel Facilities & Boarding Allocations
            // ─────────────────────────────────────────────────────────────────
            $hostelBoys = HostelRoom::query()->updateOrCreate(
                ['school_id' => $school->id, 'room_number' => 'B-101'],
                [
                    'block' => 'Nyika Hall (Boys)',
                    'gender' => 'male',
                    'capacity' => 4,
                    'floor' => 1,
                    'facilities' => 'Bunk beds, study desks, reading lamps, lockers',
                ]
            );
            $hostelGirls = HostelRoom::query()->updateOrCreate(
                ['school_id' => $school->id, 'room_number' => 'G-201'],
                [
                    'block' => 'Zomba Hall (Girls)',
                    'gender' => 'female',
                    'capacity' => 4,
                    'floor' => 2,
                    'facilities' => 'Bunk beds, study desks, reading lamps, ensuite washroom',
                ]
            );

            // Allocate boarding student (Tawonga Chirwa)
            HostelAllocation::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'student_id' => $createdStudents[1]['model']->id,
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    'hostel_room_id' => $hostelBoys->id,
                    'starts_on' => $currentYear->starts_on->toDateString(),
                    'ends_on' => $currentYear->ends_on->toDateString(),
                    'is_current' => true,
                    'allocated_by' => $staffUsers['hostel_master']->id,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 14. Transport Fleet & Student Route Subscription
            // ─────────────────────────────────────────────────────────────────
            $vehicle = Vehicle::query()->updateOrCreate(
                ['registration' => 'LL 9421'],
                [
                    'school_id' => $school->id,
                    'make' => 'Toyota',
                    'model' => 'Coaster 30-Seater',
                    'year' => 2022,
                    'capacity' => 30,
                    'driver_name' => 'Bandawo Phiri',
                    'driver_phone' => '+265882100099',
                    'status' => 'active',
                ]
            );

            $route = TransportRoute::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => 'Route 1: Area 47 · Area 10 · City Centre'],
                [
                    'vehicle_id' => $vehicle->id,
                    'direction' => 'both',
                    'pickup_points' => [
                        ['name' => 'Area 47 Sector 4 Junction', 'time' => '06:45 AM'],
                        ['name' => 'Area 10 Petroda Filling Station', 'time' => '07:05 AM'],
                        ['name' => 'City Centre Capital Hotel Roundabout', 'time' => '07:20 AM'],
                        ['name' => 'Sunrise Academy Gate', 'time' => '07:35 AM'],
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
                    'pickup_point' => 'Area 47 Sector 4 Junction',
                    'is_active' => true,
                ]
            );

            // ─────────────────────────────────────────────────────────────────
            // 15. Library Books & Borrowing Records
            // ─────────────────────────────────────────────────────────────────
            $booksData = [
                ['title' => 'Pure Mathematics for Senior Secondary Schools', 'author' => 'Backhouse & Houldsworth', 'isbn' => '9780582353862', 'cat' => 'Mathematics', 'copies' => 15, 'shelf' => 'Shelf M-02'],
                ['title' => 'IGCSE & MSCE Physics Essentials', 'author' => 'Duncan & Kennett', 'isbn' => '9781444176421', 'cat' => 'Physical Sciences', 'copies' => 20, 'shelf' => 'Shelf P-04'],
                ['title' => 'Things Fall Apart', 'author' => 'Chinua Achebe', 'isbn' => '9780385474542', 'cat' => 'Literature in English', 'copies' => 30, 'shelf' => 'Shelf L-01'],
                ['title' => 'Introduction to Algorithms and Python Programming', 'author' => 'Cormen & Stein', 'isbn' => '9780262033848', 'cat' => 'Computer Science', 'copies' => 10, 'shelf' => 'Shelf CS-03'],
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

                if ($bd['cat'] === 'Mathematics') {
                    BookBorrowing::query()->updateOrCreate(
                        [
                            'school_id' => $school->id,
                            'book_id' => $book->id,
                            'borrower_type' => Student::class,
                            'borrower_id' => $mainStudent->id,
                        ],
                        [
                            'issued_by' => $staffUsers['librarian']->id,
                            'issued_on' => Carbon::now()->subDays(10)->toDateString(),
                            'due_on' => Carbon::now()->addDays(4)->toDateString(),
                            'returned_on' => null,
                            'fine_amount' => 0,
                            'status' => 'active',
                        ]
                    );
                }
            }
        });

        $this->command?->info('✅ Sunrise Academy seeded with 5 operating terms & full operations.');
    }
}

