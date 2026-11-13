<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\ClassGroup;
use App\Models\DocumentSequence;
use App\Models\GradeLevel;
use App\Models\Guardian;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use App\Services\DocumentNumberService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class Phase1FoundationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    protected function schoolAdmin(): array
    {
        $school = School::create([
            'name' => 'Horizon Test',
            'slug' => 'horizon-test-'.uniqid(),
            'is_active' => true,
            'currency' => 'MWK',
        ]);

        $admin = User::factory()->create([
            'school_id' => $school->id,
            'status' => 'active',
            'phone' => '+265991234567',
        ]);
        $admin->assignRole('school_admin');

        return [$school, $admin];
    }

    public function test_user_can_authenticate_with_phone_number(): void
    {
        [, $admin] = $this->schoolAdmin();

        $this->post('/login', [
            'login' => '+265991234567',
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($admin);
    }

    public function test_document_numbers_increment_per_school(): void
    {
        [$school] = $this->schoolAdmin();
        $service = app(DocumentNumberService::class);

        $first = $service->next($school, DocumentSequence::TYPE_ADMISSION);
        $second = $service->next($school, DocumentSequence::TYPE_ADMISSION);

        $this->assertNotSame($first, $second);
        $this->assertStringStartsWith('ADM-'.now()->year.'-', $first);
    }

    public function test_student_csv_import_preview_and_commit(): void
    {
        [$school, $admin] = $this->schoolAdmin();

        $csv = "admission_number,first_name,last_name,gender,date_of_birth,class_name,guardian_name,guardian_phone,guardian_email,guardian_relationship,family_name\n".
            ",Chikondi,Banda,female,2012-03-01,,Mercy Banda,+26599888777,mercy@example.com,mother,Banda family\n";

        $file = UploadedFile::fake()->createWithContent('students.csv', $csv);

        $this->actingAs($admin)
            ->post(route('students.import.preview'), ['file' => $file])
            ->assertRedirect();

        $importId = \App\Models\DataImport::query()->firstOrFail()->id;

        $this->actingAs($admin)
            ->post(route('students.import.commit', $importId))
            ->assertRedirect(route('students.index'));

        $this->assertDatabaseHas('students', [
            'school_id' => $school->id,
            'first_name' => 'Chikondi',
            'last_name' => 'Banda',
        ]);
        $this->assertDatabaseHas('families', [
            'school_id' => $school->id,
            'name' => 'Banda family',
        ]);
    }

    public function test_promotion_transfer_and_graduation(): void
    {
        [$school, $admin] = $this->schoolAdmin();

        $year = AcademicYear::create([
            'school_id' => $school->id,
            'title' => '2026',
            'starts_on' => '2026-01-01',
            'ends_on' => '2026-12-31',
            'is_current' => true,
        ]);

        $grade = GradeLevel::create([
            'school_id' => $school->id,
            'code' => 'F3',
            'label' => 'Form 3',
            'sort_order' => 3,
        ]);

        $from = ClassGroup::create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'Form 3A',
        ]);

        $to = ClassGroup::create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'grade_level_id' => $grade->id,
            'name' => 'Form 4A',
        ]);

        $student = Student::create([
            'school_id' => $school->id,
            'admission_number' => 'ADM-TEST-1',
            'first_name' => 'Amina',
            'last_name' => 'Phiri',
            'gender' => 'female',
            'status' => 'active',
        ]);
        $student->enrollments()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'class_group_id' => $from->id,
            'status' => 'enrolled',
        ]);

        $this->actingAs($admin)->post(route('students.promote'), [
            'student_ids' => [$student->id],
            'to_class_group_id' => $to->id,
        ])->assertRedirect();

        $this->assertDatabaseHas('student_enrollments', [
            'student_id' => $student->id,
            'class_group_id' => $to->id,
            'status' => 'enrolled',
        ]);

        $this->actingAs($admin)->post(route('students.transfer'), [
            'student_id' => $student->id,
            'reason' => 'Relocating',
            'destination' => 'City Academy',
            'clearance' => ['fees' => true, 'library' => true, 'stores' => true],
        ])->assertRedirect();

        $student->refresh();
        $this->assertSame('transferred', $student->status);

        $graduate = Student::create([
            'school_id' => $school->id,
            'admission_number' => 'ADM-TEST-2',
            'first_name' => 'Tiwonge',
            'last_name' => 'Moyo',
            'status' => 'active',
        ]);

        $this->actingAs($admin)->post(route('students.graduate'), [
            'student_ids' => [$graduate->id],
            'reason' => 'Completed Form 4',
        ])->assertRedirect();

        $this->assertSame('graduated', $graduate->fresh()->status);
    }

    public function test_unverified_parent_cannot_log_in(): void
    {
        [$school] = $this->schoolAdmin();

        $parent = User::factory()->create([
            'school_id' => $school->id,
            'email' => 'parent.wait@example.com',
            'status' => 'active',
        ]);
        $parent->assignRole('parent');

        Guardian::create([
            'school_id' => $school->id,
            'user_id' => $parent->id,
            'first_name' => 'Mercy',
            'last_name' => 'Banda',
            'phone' => '+26599000001',
            'email' => 'parent.wait@example.com',
        ]);

        $this->post('/login', [
            'login' => 'parent.wait@example.com',
            'password' => 'password',
        ])->assertSessionHasErrors('login');

        $this->assertGuest();
    }

    public function test_school_admin_cannot_export_another_tenant_via_isolation(): void
    {
        [$schoolA, $adminA] = $this->schoolAdmin();
        [$schoolB] = $this->schoolAdmin();

        Student::create([
            'school_id' => $schoolB->id,
            'admission_number' => 'SECRET-1',
            'first_name' => 'Hidden',
            'last_name' => 'Learner',
            'status' => 'active',
        ]);

        $response = $this->actingAs($adminA)->get(route('students.export'));
        $response->assertOk();
        $this->assertStringNotContainsString('SECRET-1', $response->streamedContent());
        $this->assertSame($schoolA->id, $adminA->school_id);
    }
}
