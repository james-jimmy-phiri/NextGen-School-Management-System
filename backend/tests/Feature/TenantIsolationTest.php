<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected School $schoolA;
    protected School $schoolB;
    protected User $adminA;
    protected User $adminB;
    protected Student $studentA;
    protected Student $studentB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->schoolA = School::create([
            'name' => 'School Alpha',
            'slug' => 'school-alpha',
            'code' => 'ALPHA',
            'is_active' => true,
        ]);

        $this->schoolB = School::create([
            'name' => 'School Beta',
            'slug' => 'school-beta',
            'code' => 'BETA',
            'is_active' => true,
        ]);

        $schoolAdminRole = Role::findByName('school_admin', 'web');

        $this->adminA = User::factory()->create([
            'school_id' => $this->schoolA->id,
            'status' => 'active',
        ]);
        $this->adminA->assignRole($schoolAdminRole);

        $this->adminB = User::factory()->create([
            'school_id' => $this->schoolB->id,
            'status' => 'active',
        ]);
        $this->adminB->assignRole($schoolAdminRole);

        $this->studentA = Student::create([
            'school_id' => $this->schoolA->id,
            'admission_number' => 'ADM-A-001',
            'first_name' => 'John',
            'last_name' => 'Alpha',
            'gender' => 'male',
            'status' => 'active',
        ]);

        $this->studentB = Student::create([
            'school_id' => $this->schoolB->id,
            'admission_number' => 'ADM-B-001',
            'first_name' => 'Jane',
            'last_name' => 'Beta',
            'gender' => 'female',
            'status' => 'active',
        ]);
    }

    public function test_school_a_cannot_view_school_b_student_profile(): void
    {
        $response = $this->actingAs($this->adminA)->get("/students/{$this->studentB->id}");

        $response->assertForbidden();
    }

    public function test_school_a_student_list_does_not_contain_school_b_students(): void
    {
        $response = $this->actingAs($this->adminA)->get('/students');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Students/Index')
            ->has('students.data', 1)
            ->where('students.data.0.id', $this->studentA->id)
            ->where('students.data.0.first_name', 'John')
        );
    }

    public function test_school_a_cannot_transfer_school_b_student(): void
    {
        $response = $this->actingAs($this->adminA)->post('/students/transfers', [
            'student_id' => $this->studentB->id,
            'reason' => 'Relocation',
        ]);

        $response->assertNotFound();
    }
}
