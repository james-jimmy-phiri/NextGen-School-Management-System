<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SanctumAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_issues_sanctum_token_and_returns_structured_identity(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $superAdminRole = Role::findByName('super_admin', 'web');

        $this->assertNotNull($superAdminRole);

        /** @var User $user */
        $user = User::factory()->create();
        $user->assignRole($superAdminRole);

        $response = $this->postJson('/api/v1/auth/token', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['id', 'email', 'roles'],
                ],
            ]);
    }

    public function test_rejects_invalid_credentials(): void
    {
        $this->seed(RolePermissionSeeder::class);

        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/auth/token', [
            'email' => $user->email,
            'password' => 'incorrect-password-example',
        ]);

        $response->assertUnauthorized();
    }
}
