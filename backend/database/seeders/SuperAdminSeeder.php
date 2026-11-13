<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        $platformAdmin = User::query()->updateOrCreate(
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

        $platformAdmin->syncRoles(['super_admin']);

        $this->command?->info('✅ Super Administrator seeded: super.admin@nextgen.mw');
    }
}

