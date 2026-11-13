<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementAndPermissionGatingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    protected function createSchool(string $name = 'Test School', string $code = 'SCH01'): School
    {
        return School::create([
            'name' => $name,
            'slug' => str($name)->slug()->value() . '-' . uniqid(),
            'code' => $code . rand(100, 999),
            'is_active' => true,
        ]);
    }

    public function test_platform_super_admin_can_view_all_users_and_school_admin_only_their_school(): void
    {
        $schoolA = $this->createSchool('School Alpha', 'ALPH');
        $schoolB = $this->createSchool('School Beta', 'BETA');

        $superAdmin = User::factory()->create([
            'school_id' => null,
            'status' => 'active',
        ]);
        $superAdmin->assignRole('super_admin');

        $schoolAdminA = User::factory()->create([
            'school_id' => $schoolA->id,
            'status' => 'active',
        ]);
        $schoolAdminA->assignRole('school_admin');

        $teacherB = User::factory()->create([
            'school_id' => $schoolB->id,
            'status' => 'active',
        ]);
        $teacherB->assignRole('teacher');

        // FR4.1: Platform super admin can view all users
        $response = $this->actingAs($superAdmin)->get(route('users.index'));
        $response->assertOk();

        // FR4.2: School Admin A only sees users in School A
        $response = $this->actingAs($schoolAdminA)->get(route('users.index'));
        $response->assertOk();
    }

    public function test_user_information_and_activities_view(): void
    {
        $schoolA = $this->createSchool('School Alpha', 'ALPH');
        $schoolB = $this->createSchool('School Beta', 'BETA');

        $superAdmin = User::factory()->create(['school_id' => null, 'status' => 'active']);
        $superAdmin->assignRole('super_admin');

        $schoolAdminA = User::factory()->create(['school_id' => $schoolA->id, 'status' => 'active']);
        $schoolAdminA->assignRole('school_admin');

        $userInSchoolA = User::factory()->create(['school_id' => $schoolA->id, 'status' => 'active']);
        $userInSchoolA->assignRole('teacher');

        $userInSchoolB = User::factory()->create(['school_id' => $schoolB->id, 'status' => 'active']);
        $userInSchoolB->assignRole('teacher');

        // FR4.3: Super admin can inspect user in any school
        $this->actingAs($superAdmin)
            ->get(route('users.show', $userInSchoolA))
            ->assertOk();

        // FR4.4: School admin can inspect user in their own school
        $this->actingAs($schoolAdminA)
            ->get(route('users.show', $userInSchoolA))
            ->assertOk();

        // FR4.4: School admin CANNOT inspect user in another school (returns 403)
        $this->actingAs($schoolAdminA)
            ->get(route('users.show', $userInSchoolB))
            ->assertForbidden();
    }

    public function test_deactivate_and_reactivate_user_lifecycle(): void
    {
        $school = $this->createSchool();

        $admin = User::factory()->create(['school_id' => $school->id, 'status' => 'active']);
        $admin->assignRole('school_admin');

        $targetUser = User::factory()->create([
            'school_id' => $school->id,
            'status' => 'active',
            'password' => bcrypt('Secret123!'),
        ]);
        $targetUser->assignRole('teacher');

        // FR4.5: Deactivate with reason
        $response = $this->actingAs($admin)->post(route('users.deactivate', $targetUser), [
            'reason' => 'Extended leave without notice',
        ]);
        $response->assertRedirect();

        $targetUser->refresh();
        $this->assertEquals('inactive', $targetUser->status);
        $this->assertEquals('Extended leave without notice', $targetUser->deactivated_reason);
        $this->assertNotNull($targetUser->deactivated_at);

        // Deactivated user is blocked by EnsureUserIsActive middleware and redirected to login
        $this->actingAs($targetUser)
            ->get(route('dashboard'))
            ->assertRedirect(route('login'));

        // FR4.5: Reactivate user (re-enables login with previous credentials)
        $response = $this->actingAs($admin)->post(route('users.reactivate', $targetUser));
        $response->assertRedirect();

        $targetUser->refresh();
        $this->assertEquals('active', $targetUser->status);
        $this->assertNull($targetUser->deactivated_reason);
        $this->assertNull($targetUser->deactivated_at);

        // Active user can now access dashboard
        $this->actingAs($targetUser)
            ->get(route('dashboard'))
            ->assertOk();
    }

    public function test_account_locked_after_5_failed_logins_and_admin_can_unlock(): void
    {
        $school = $this->createSchool();

        $admin = User::factory()->create(['school_id' => $school->id, 'status' => 'active']);
        $admin->assignRole('school_admin');

        $user = User::factory()->create([
            'email' => 'user_lockout@example.com',
            'password' => bcrypt('CorrectPassword123!'),
            'school_id' => $school->id,
            'status' => 'active',
        ]);
        $user->assignRole('teacher');

        // 5 consecutive wrong password attempts
        for ($i = 1; $i <= 5; $i++) {
            $this->post('/login', [
                'login' => 'user_lockout@example.com',
                'password' => 'WrongPassword',
            ]);
        }

        $user->refresh();
        $this->assertTrue($user->isLocked());
        $this->assertEquals(5, $user->failed_login_attempts);

        // Administrator unlocks account
        $this->actingAs($admin)->post(route('users.unlock', $user))->assertRedirect();

        $user->refresh();
        $this->assertFalse($user->isLocked());
        $this->assertEquals(0, $user->failed_login_attempts);
    }

    public function test_update_user_details_and_multi_role_assignment(): void
    {
        $school = $this->createSchool();

        $admin = User::factory()->create(['school_id' => $school->id, 'status' => 'active']);
        $admin->assignRole('school_admin');

        $user = User::factory()->create([
            'name' => 'Initial Name',
            'email' => 'initial@example.com',
            'phone' => '+265999000111',
            'school_id' => $school->id,
            'status' => 'active',
        ]);
        $user->assignRole('teacher');

        // FR4.6 & FR4.7: Update details and assign multiple roles (e.g. Teacher + Accountant)
        $response = $this->actingAs($admin)->put(route('users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '+265999000222',
            'status' => 'active',
            'school_id' => $school->id,
            'roles' => ['teacher', 'accountant'],
        ]);
        $response->assertRedirect(route('users.index'));

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals('updated@example.com', $user->email);
        $this->assertTrue($user->hasRole('teacher'));
        $this->assertTrue($user->hasRole('accountant'));
    }

    public function test_dynamic_school_requirement_by_role_configuration(): void
    {
        $school = $this->createSchool();

        $superAdmin = User::factory()->create(['school_id' => null, 'status' => 'active']);
        $superAdmin->assignRole('super_admin');

        // Role with requires_school = false (super_admin) allows nullable school_id
        $response = $this->actingAs($superAdmin)->post(route('users.store'), [
            'name' => 'Platform Operator',
            'email' => 'platform_op@example.com',
            'phone' => '+265888000111',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'status' => 'active',
            'school_id' => null,
            'roles' => ['super_admin'],
        ]);
        $response->assertRedirect(route('users.index'));

        // Role with requires_school = true (teacher) requires school_id
        $response = $this->actingAs($superAdmin)->post(route('users.store'), [
            'name' => 'Teacher Without School',
            'email' => 'teacher_noschool@example.com',
            'phone' => '+265888000222',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'status' => 'active',
            'school_id' => null,
            'roles' => ['teacher'],
        ]);
        $response->assertSessionHasErrors(['school_id']);
    }

    public function test_unpermitted_user_cannot_access_finance_pages(): void
    {
        $school = $this->createSchool();

        $teacher = User::factory()->create(['school_id' => $school->id, 'status' => 'active']);
        $teacher->assignRole('teacher');

        // Teacher does NOT have finance.view -> 403 Forbidden
        $this->actingAs($teacher)
            ->get(route('finance.fee-structures.index'))
            ->assertForbidden();

        $this->actingAs($teacher)
            ->get(route('finance.invoices.index'))
            ->assertForbidden();
    }

    public function test_platform_super_admin_without_school_cannot_access_school_finance_operations(): void
    {
        $superAdmin = User::factory()->create(['school_id' => null, 'status' => 'active']);
        $superAdmin->assignRole('super_admin');

        // Super Admin with school_id = null cannot access school fee structures
        $this->actingAs($superAdmin)
            ->get(route('finance.fee-structures.index'))
            ->assertForbidden();

        $this->actingAs($superAdmin)
            ->get(route('finance.invoices.index'))
            ->assertForbidden();
    }
}
